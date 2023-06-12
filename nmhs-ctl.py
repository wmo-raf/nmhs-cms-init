import argparse
import os
import shutil
import subprocess
import fileinput
import re

# ANSI escape codes for text colors
RED = '\033[91m'
GREEN = '\033[92m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
MAGENTA = '\033[95m'
CYAN = '\033[96m'
RESET = '\033[0m'

DOCKER_COMPOSE_ARGS = """
    --env-file .env
    """

exec_mautic = False

parser = argparse.ArgumentParser(
    description='manage a composition of docker containers to implement a nmhs cms instance',
    formatter_class=argparse.RawTextHelpFormatter)

parser.add_argument(
    '--simulate',
    dest='simulate',
    action='store_true',
    help='simulate execution by printing action rather than executing')

commands = [
    'setup_cms',
    'setup_db',
    'setup_mautic',
    'setup_recaptcha',
    'quickstart',
    'build',
    'config',
    'down',
    'execute',
    'logs',
    'login',
    'prune',
    'restart',
    'start',
    'status',
    'stop',
    'up',
    'update',

    # python manage.py commands 
    'dumpdata',
    'loaddata',
    'forecast',
    'migrate',
    'collectstatic',
    'createsuperuser'
]

parser.add_argument('command',
                    choices=commands,
                    help="""
    - setup_XX: setup environment variables
    - config: validate and view Docker configuration
    - quickstart: run a quick instance with default params
    - build [containers]: build all services
    - start [containers]: start system
    - login [container]: login to the container (default: cms_web)
    - login-root [container]: login to the container as root
    - stop: stop [container] system
    - update: update Docker images
    - prune: cleanup dangling containers and images
    - restart [containers]: restart one or all containers
    - status [containers|-a]: view status of containers
    - dumpdata: creates a dump_data.json of the database in cms_web container
    - loaddata: loads dump_data.json into database in cms_web container
    - migrate: migrates columns and tables of database in cms_web container
    - collectstatic: collects static files into a single location that can easily be served in production in cms_web container
    - forecast: ingests next 7-day forecast in cms_web container from yr.no weather forecast API
    - createsuperuser: create admin superuser
    """)

parser.add_argument('args', nargs=argparse.REMAINDER)

args = parser.parse_args()

def update_nginx(suffix):
    nginx_conf_file = 'nginx/nginx.conf'
    new_proxy_pass = 'http://cms_web/'+suffix

    # Use fileinput to modify the nginx.conf file in-place
    with fileinput.FileInput(nginx_conf_file, inplace=True, backup='.bak') as file:
        inside_location_block = False
        for line in file:
            # Search for the location directive with /
            if re.match(r'\s*location\s*/', line):
                inside_location_block = True
            elif inside_location_block and line.strip() == '}':
                inside_location_block = False

            # Update the proxy_pass directive inside the location block
            if inside_location_block and 'proxy_pass' in line:
                line = line.replace(line.strip(), f'proxy_pass {new_proxy_pass};')
                
            print(line, end='')

    print("nginx.conf updated successfully.")

def setup_config(env_inputs):
    # Get the default value from the .env file
    # Load existing .env values
    env_values = {}
    with open('.env', 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#'):
                key, value = line.split('=', 1)
                env_values[key] = value

    # list user input variables to be updated in .env             
    # env_inputs =[
    #     'POSTGRES_PORT_CMS',
    #     'POSTGRES_PASSWORD_CMS',
    # ]

    if type(env_inputs) == list:
        for val in env_inputs:
            # Get the default value from the .env file
            default_value = env_values.get(val)

            # Prompt the user for the values
            user_input = input(f"{YELLOW} ENTER {val}:{GREEN} (default -> {default_value}). {CYAN} Press enter to accept default {RESET}")  or default_value
            
            user_input = user_input if not user_input.isspace() else ''

            if val == "ENVIRONMENT":
                while user_input != "dev" or user_input != "production":

                    if user_input == "dev" or user_input == "production":
                        break

                    print(f"{RED}Accepts only 'dev' or 'production' {RESET}")
                    user_input = input(f"{YELLOW} ENTER {val}:{GREEN} (default -> {default_value}). {CYAN} Press enter to accept default {RESET}")  or default_value

            elif val == "DEBUG":
                while user_input != "True" or user_input != "False":

                    if user_input == "True" or user_input == "False":
                        break

                    print(f"{RED}Accepts only 'True' or 'False' {RESET}")
                    user_input = input(f"{YELLOW} ENTER {val}:{GREEN} (default -> {default_value}). {CYAN} Press enter to accept default {RESET}")  or default_value


            elif val == "BASE_PATH":
                # if string is not empty
                if len(user_input)>0:
                    user_input = f"{user_input}/"
                    # link with nginx and add leading and trailing slashes
                    update_nginx(user_input)
                else:
                    update_nginx(f"")


            # Update the .env file
            updated_lines = []   

            with open('.env', 'r') as f:
                lines = f.readlines()
                key_found = False
                for line in lines:
                    if line.startswith(val + '='):
                        line = f"{val}={user_input if not user_input.isspace() else ''}\n"
                        key_found=True

                    updated_lines.append(line)

                if not key_found:
                    updated_lines.append(f"\n{val}={user_input}")


            with open('.env', 'w') as f:
                f.writelines(updated_lines)

    else:
        print("only accepts variables as list")

def split(value: str) -> list:
    """
    Splits string and returns as list
    :param value: required, string. bash command.
    :returns: list. List of separated arguments.
    """
    return value.split()

def run(args, cmd, asciiPipe=False) -> str:

    if args.simulate:
        if asciiPipe:
            print(f"simulation: {' '.join(cmd)} >/tmp/temp_buffer$$.txt")
        else:
            print(f"simulation: {' '.join(cmd)}")
        return '`cat /tmp/temp_buffer$$.txt`'
    else:
        if asciiPipe:
            return subprocess.run(
                cmd, stdout=subprocess.PIPE).stdout.decode('ascii')
        else:
            subprocess.run(cmd)
    return None


def make(args) -> None:
    """
    Serves as pseudo Makefile using Python subprocesses.
    :param command: required, string. Make command.
    :returns: None.
    """
    user_mautic_input = input(f"Do you want to run mautic alongside CMS? {CYAN} Y or N? {RESET}")

    docker_compose_args = DOCKER_COMPOSE_ARGS + '--file docker-compose.mautic.yml' if exec_mautic else'--file docker-compose.yml'

    

    # if you selected a bunch of them, default to all
    containers = "" if not args.args else ' '.join(args.args)

    # if there can be only one, default to cms_web
    container = "cms_web" if not args.args else ' '.join(args.args)

    if args.command == "config":
        run(args, split(f'docker-compose {docker_compose_args} config'))
    elif args.command == "build":
        run(args, split(
            f'docker-compose {docker_compose_args} build {containers}'))
    elif args.command in ["up", "start"]:
        print(f"{GREEN}STARTING SERVICES{RESET}")

        if containers:
            run(args, split(f"docker-compose {docker_compose_args} start {containers}"))
        else:
            print(f"{YELLOW}=> [1/3] STARTING CONTAINERS AGAIN {RESET}")
            run(args, split(f'docker-compose {docker_compose_args} up -d'))

            print(f"{YELLOW}=> [2/3] MIGRATING DATABASE TABLES {RESET}")
            run(args, split(
                f'docker-compose {docker_compose_args} exec -T cms_web python manage.py makemigrations'))
            run(args, split(
                f'docker-compose {docker_compose_args} exec -T cms_web python manage.py migrate'))
            
            print(f"{YELLOW}=> [3/53 COLLECTING STATIC FILES {RESET}")
            run(args, split(
                f'docker-compose {docker_compose_args} exec -T cms_web python manage.py collectstatic --clear --no-input'))
            
        print(f"{GREEN}\u2713 OPERATION HAS BEEN COMPLETED {RESET}")

    elif args.command == "execute":
        run(args, ['docker', 'exec', '-i', 'cms_web', 'sh', '-c', containers])
    elif args.command == "login":
        run(args, split(f'docker exec -it {container} /bin/bash'))
    elif args.command == "login-root":
        run(args, split(f'docker exec -u -0 -it {container} /bin/bash'))
    elif args.command == "logs":
        run(args, split(
            f'docker-compose {docker_compose_args} logs --follow {containers}'))
    elif args.command in ["stop", "down"]:
        if containers:
            run(args, split(f"docker-compose {docker_compose_args} {containers}"))
        else:
            run(args, split(
                f'docker-compose {docker_compose_args} down --remove-orphans {containers}')) 
    elif args.command == "update":
        run(args, split(f'docker-compose {docker_compose_args} pull'))
    elif args.command == "prune":
        run(args, split('docker builder prune -f'))
        run(args, split('docker container prune -f'))
        run(args, split('docker volume prune -f'))
        _ = run(args,
                split('docker images --filter dangling=true -q --no-trunc'),
                asciiPipe=True)
        run(args, split(f'docker rmi {_}'))
        _ = run(args, split('docker ps -a -q'), asciiPipe=True)
        run(args, split(f'docker rm {_}'))
    elif args.command == "restart":
        print(f"{GREEN}RESTARTING ALL SERVICES{RESET}")
        
        if containers:
            print(f"{YELLOW}=> [1/2] STOPPING CONTAINERS {RESET}")
            run(args, split(
                f'docker-compose {docker_compose_args} stop {containers}'))
        
            print(f"{YELLOW}=> [2/2] STARTING CONTAINERS AGAIN {RESET}")
            run(args, split(
                f'docker-compose {docker_compose_args} start {containers}'))
        else:
            print(f"{YELLOW}=> [1/5] STOPPING AND REMOVING CONTAINERS, IMAGES & NETWORKS {RESET}")
            run(args, split(
                f'docker-compose {docker_compose_args} down --remove-orphans'))
            
            print(f"{YELLOW}=> [2/5] BUILDING IMAGES {RESET}")
            run(args, split(
                f'docker-compose {docker_compose_args} build'))
            
            print(f"{YELLOW}=> [3/5] STARTING CONTAINERS AGAIN {RESET}")
            run(args, split(
                f'docker-compose {docker_compose_args} up -d --force-recreate'))
            
            print(f"{YELLOW}=> [4/5] MIGRATING DATABASE TABLES {RESET}")
            run(args, split(
                f'docker-compose {docker_compose_args} exec -T cms_web python manage.py makemigrations'))
            run(args, split(
                f'docker-compose {docker_compose_args} exec -T cms_web python manage.py migrate --fake'))
            
            print(f"{YELLOW}=> [5/5] COLLECTING STATIC FILES {RESET}")
            run(args, split(
                f'docker-compose {docker_compose_args} exec -T cms_web python manage.py collectstatic --clear --no-input'))
            
        print(f"{GREEN}\u2713 OPERATION HAS BEEN COMPLETED {RESET}")

    elif args.command == "status":
        run(args, split(
            f'docker-compose {docker_compose_args} ps {containers}'))
        

    elif args.command == "quickstart":
        print(f"{GREEN}RUNNING QUICKSTART INSTANCE {RESET}")
        print(f"{YELLOW}=> [1/6] BUILDING CONTAINERS {RESET}")
        run(args, split(
            f'docker-compose {docker_compose_args} build {containers}'))
        
        print(f"{YELLOW}=> [2/6] STARTING UP CONTAINERS {RESET}")
        run(args, split(
            f'docker-compose {docker_compose_args} up -d'))
        
        print(f"{YELLOW}=> [3/6] MIGRATING DATABASE TABLES {RESET}")
        run(args, split(
            f'docker-compose {docker_compose_args} exec -T cms_web python manage.py makemigrations'))
        run(args, split(
            f'docker-compose {docker_compose_args} exec -T cms_web python manage.py migrate'))
        
        print(f"{YELLOW}=> [4/6] LOADING DUMP DATA {RESET}")
        run(args, split(
            f'docker-compose {docker_compose_args} exec -T cms_web python manage.py loaddata dumpdata.json'))
        
        print(f"{YELLOW}=> [5/6] COLLECTING STATIC FILES {RESET}")
        run(args, split(
            f'docker-compose {docker_compose_args} exec -T cms_web python manage.py collectstatic --clear --no-input'))
        
        print(f"{YELLOW}=> [6/6] FETCHING 7-DAY FORECAST {RESET}")
        run(args, split(
            f'docker-compose {docker_compose_args} exec -T cms_web python manage.py generate_forecast'))
        
        print(f"{GREEN}\u2713 OPERATION HAS BEEN COMPLETED {RESET}")

    elif args.command == "dumpdata":
        run(args, split(
            f'docker-compose {docker_compose_args} exec -T cms_web python manage.py dumpdata --natural-foreign --natural-primary --indent 2'   
            ' --exclude wagtailcore.ReferenceIndex -e wagtailsearch.indexentry -e wagtailimages.rendition -e sessions > dumpdata.json'))
    
    elif args.command == "loaddata":
        run(args, split(
            f'docker-compose {docker_compose_args} exec -T cms_web python manage.py loaddata dumpdata.json'))
    elif args.command == "forecast":
        run(args, split(
            f'docker-compose {docker_compose_args} exec -T cms_web python manage.py generate_forecast'))
    elif args.command == "createsuperuser":
        run(args, split(
            f'docker-compose {docker_compose_args} exec cms_web python manage.py createsuperuser'))
    elif args.command == "migrate":
        run(args, split(
            f'docker-compose {docker_compose_args} exec -T cms_web python manage.py makemigrations'))
        run(args, split(
            f'docker-compose {docker_compose_args} exec -T cms_web python manage.py migrate'))
    elif args.command == "collectstatic":
        run(args, split(
            f'docker-compose {docker_compose_args} exec -T cms_web python manage.py collectstatic --clear --no-input'))
    elif args.command == "setup_db":
        print(f"{MAGENTA}Setting up PostgreSQL Configs...{RESET}")
        setup_config([
            'POSTGRES_PORT_CMS',
            'POSTGRES_PASSWORD_CMS',
        ])
        print(f"{MAGENTA}\u2713 Completed PostgreSQL Setup... Run {CYAN}'python3 nmhs-ctl.py restart' to reload changes{RESET}")


    elif args.command == "setup_mautic":
        print("Setting up Mautic Configs...")
        setup_config([
            'MAUTIC_DB_USER',
            'MAUTIC_DB_PASSWORD',
            'MYSQL_ROOT_PASSWORD'
        ])
        print(f"{MAGENTA}\u2713 Completed Mautic Setup... Run {CYAN}'python3 nmhs-ctl.py restart' to reload changes{RESET}")

    
    elif args.command == "setup_recaptcha":
        print("Setting up Mautic Configs...")
        setup_config([
            'RECAPTCHA_PRIVATE_KEY',
            'RECAPTCHA_PUBLIC_KEY',
        ])
        print(f"{MAGENTA}\u2713 Completed Recaptcha Setup... Run {CYAN}'python3 nmhs-ctl.py restart' to reload changes{RESET}")


    elif args.command == "setup_cms":
        print(f"{MAGENTA}Setting up CMS Configs...{RESET}")
        setup_config([
            'ENVIRONMENT',
            'DEBUG',
            'CMS_HOST',
            'CMS_PORT',
            'BASE_PATH',
        ])

        print(f"{MAGENTA}\u2713 Completed CMS Setup... Run {CYAN}'python3 nmhs-ctl.py restart'{MAGENTA} to reload changes{RESET}")

if __name__ == "__main__":

    # create production ready files from sample files 
    config_files ={
        'env':['.env', '.env.sample'],
        'nginx':['nginx/nginx.conf','nginx/nginx.sample.conf' ]
    }

    for config in config_files:
        sample_file = config_files[config][1]
        prod_file = config_files[config][0]

        if not os.path.exists(prod_file):
            shutil.copy(sample_file, prod_file)
            print(f"{prod_file} file created from {sample_file}.")
            
    make(args)
