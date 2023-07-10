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
    'launch',
    'config',
    'down',
    'execute',
    'logs',
    'login',
    'prune',
    'status',
    'stop',

    # python manage.py commands 
    'forecast',
    'createsuperuser'
]

parser.add_argument('command',
                    choices=commands,
                    help="""
    - setup_XX: setup environment variables
    - config: validate and view Docker configuration
    - launch: run a quick instance with default params
    - login [container]: login to the container (default: cms_web)
    - login-root [container]: login to the container as root
    - stop: stop [container] system
    - update: update Docker images
    - prune: cleanup dangling containers and images
    - status [containers|-a]: view status of containers
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

def setup_docker_args():
    user_mautic_input = input(f"Do you want to run mautic alongside CMS? {CYAN} Y or N? {RESET}")

    while user_mautic_input != 'y' or user_mautic_input != 'Y' or user_mautic_input != 'N' or user_mautic_input != 'n':

        if user_mautic_input == 'y' or user_mautic_input ==  'Y'  or user_mautic_input == 'N' or user_mautic_input ==  'n':

            docker_compose_args = DOCKER_COMPOSE_ARGS + '--file docker-compose.mautic.yml' if user_mautic_input == 'y' or user_mautic_input ==  'Y' else DOCKER_COMPOSE_ARGS
            break

        print(f"{RED}Accepts only 'Y' or 'N' {RESET}")
        user_mautic_input = input(f"Do you want to run mautic alongside CMS? {CYAN} Y or N? {RESET}")


    return docker_compose_args
    

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
    # if you selected a bunch of them, default to all
    containers = "" if not args.args else ' '.join(args.args)

    # if there can be only one, default to cms_web
    container = "cms_web" if not args.args else ' '.join(args.args)

    if args.command == "config":
        docker_compose_args = setup_docker_args()

        run(args, split(f'docker-compose {docker_compose_args} config'))

    elif args.command == "execute":
        run(args, ['docker', 'exec', '-i', 'cms_web', 'sh', '-c', containers])

    elif args.command == "login":
        run(args, split(f'docker exec -it {container} /bin/bash'))

    elif args.command == "login-root":
        run(args, split(f'docker exec -u -0 -it {container} /bin/bash'))

    elif args.command == "logs":
        docker_compose_args = setup_docker_args()

        run(args, split(
            f'docker-compose {docker_compose_args} logs --follow {containers}'))
        
    elif args.command in ["stop", "down"]:
        docker_compose_args = setup_docker_args()

        if containers:
            run(args, split(f"docker-compose {docker_compose_args} {containers}"))
        else:
            run(args, split(
                f'docker-compose {docker_compose_args} down --remove-orphans {containers}')) 
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
    
    elif args.command == "status":
        docker_compose_args = setup_docker_args()
        run(args, split(
            f'docker-compose {docker_compose_args} ps {containers}'))
        
    elif args.command == "launch":
        docker_compose_args = setup_docker_args()

        print(f"{GREEN}RUNNING QUICKSTART INSTANCE {RESET}")
        print(f"{YELLOW}=> [1/4] BUILDING CONTAINERS {RESET}")
        run(args, split(
            f'docker-compose {docker_compose_args} build {containers}'))
        
        print(f"{YELLOW}=> [2/4] STARTING UP CONTAINERS {RESET}")
        run(args, split(
            f'docker-compose {docker_compose_args} up -d'))
        
        print(f"{YELLOW}=> [4/4] COLLECTING STATIC FILES {RESET}")
        run(args, split(
            f'docker-compose {docker_compose_args} exec cms_web python manage.py collectstatic --clear --no-input'))
        
        print(f"{GREEN}\u2713 OPERATION HAS BEEN COMPLETED {RESET}")
    
    elif args.command == "createsuperuser":
        # docker_compose_args = setup_docker_args()

        run(args, split(
            f'docker-compose {DOCKER_COMPOSE_ARGS} exec cms_web python manage.py createsuperuser'))
        
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
        print(f"{MAGENTA}\u2713 Completed Mautic Setup... Run {CYAN}'python3 nmhs-ctl.py launch' to reload changes{RESET}")

    
    elif args.command == "setup_recaptcha":
        print("Setting up Mautic Configs...")
        setup_config([
            'RECAPTCHA_PRIVATE_KEY',
            'RECAPTCHA_PUBLIC_KEY',
        ])
        print(f"{MAGENTA}\u2713 Completed Recaptcha Setup... Run {CYAN}'python3 nmhs-ctl.py launch' to reload changes{RESET}")


    elif args.command == "setup_cms":
        print(f"{MAGENTA}Setting up CMS Configs...{RESET}")
        setup_config([
            'ENVIRONMENT',
            'DJANGO_DEBUG',
            'CMS_PORT',
            'BASE_PATH',
        ])

        print(f"{MAGENTA}\u2713 Completed CMS Setup... Run {CYAN}'python3 nmhs-ctl.py launch'{MAGENTA} to reload changes{RESET}")

if __name__ == "__main__":

    # create production ready files from sample files 
    # config_files ={
    #     'env':['.env', '.env.sample'],
    #     'nginx':['nginx/nginx.conf','nginx/nginx.sample.conf' ]
    # }

    # for config in config_files:
    #     sample_file = config_files[config][1]
    #     prod_file = config_files[config][0]

    #     if not os.path.exists(prod_file):
    #         shutil.copy(sample_file, prod_file)
    #         print(f"{prod_file} file created from {sample_file}.")
            
    make(args)
