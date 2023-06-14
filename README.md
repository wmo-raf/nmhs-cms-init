# nmhs-cms

Content Management System for NMHSs in Africa

---

## User Guide

Read more from the user guide - https://github.com/wmo-raf/nmhs-cms/wiki

---

## Prerequisites

Before installing the CMS, there are a few prerequisites to consider installing on your server:

1. **Docker Engine:** Ensure that Docker Engine is installed and running on the machine where you plan to execute the docker-compose command https://docs.docker.com/engine/install/. Docker Engine is the runtime environment for containers.

2. **Docker Compose:** Install Docker Compose https://docs.docker.com/compose/install/ on the machine where you intend to run the command. Docker Compose is a tool that allows you to define and manage multi-container Docker applications using a YAML configuration file.

3. **Python 3:** Ensure that Python 3 is installed on your machine. You can download the Python installer from the official Python website (https://www.python.org/downloads/) and follow the installation instructions for your operating system.

---
## Quickstart Installation with Test Data

The `quickstart` arguement in `nmhs-ctl.py` deploys nmhs-cms with test data with a single command and requires python3 setup. When using nmhs-cms from source, the default port for web components is 8081.

1. Download from source:

    `git clone https://github.com/wmo-raf/nmhs-cms-init.git`

    `cd nmhs-cms`

2. Setup environmental variables

    Prepare a '.env' file with necessary variables from '.env.sample'

    `cp .env.sample .env`

    Edit and replace variables approriately

2. Build and launch a running instance of the CMS.

    `python3 nmhs-ctl.py launch`

    The `quickstart` executes the following steps:

    ```py
    [1/5] BUILDING CONTAINERS
    [2/5] STARTING UP CONTAINERS 
    [3/5] LOADING INITIAL WEATHER CONDITIONS DATA
    [4/5] LOADING INITIAL COUNTRIES DATA 
    [5/5] COLLECTING STATIC FILES
    ```

    The instance can be found at `http://localhost:{CMS_PORT}`

3. Additionally, create superuser to access the CMS Admin interface:

    `python3 nmhs-ctl.py createsuperuser`

---

## Other useful commands

| Command      | Purpose |
| -------- | ----- | 
| `config` |  validate and view the Compose file configuration |
| `login` | interact with the container's command line and execute commands as if you were directly logged into the container |
| `login-root` | access a running Docker container and open a Bash shell inside it with the root user |
| `logs` | real-time output of the containers' logs |
| `stop/down` | stop and remove Docker containers |
| `prune` | clean up unused Docker resources such as containers, images, networks, and volumes. ***Exercise caution when using these commands and ensure that you do not accidentally remove resources that are still needed.*** |
| `status` | display container names, their status (running, stopped), the associated services, and their respective health states |
| `forecast` | fetch 7-day forecast from external source (https://developer.yr.no/) |
<!-- | `setup_mautic` | setup mautic environmental variables i.e `MAUTIC_DB_USER`,`MAUTIC_DB_PASSWORD` and  `MYSQL_ROOT_PASSWORD`,    |
| `setup_recaptcha` | setup recaptcha environmental variables i.e `RECAPTCHA_PRIVATE_KEY` and `RECAPTCHA_PUBLIC_KEY`|
| `setup_cms` | setting up CMS Configs |
| `setup_db` | Setting up PostgreSQL Configs | -->

