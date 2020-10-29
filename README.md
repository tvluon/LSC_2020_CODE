# LSCweb

## Private Core server
1. Go to folder `Dat/lifelog_retrieval` at NICT server
2. Activate `pytojt` environment and run command: `python app_server.py`
3. Run port fowarding command: `ssh -p <ssh_port> -i <ssh_key_path> -N -L 5000:127.0.0.1:5000 dat@localhost`

## Dynamic website
1. Extract `lsc2020.zip` and move extracted folder to `public/dataset`
2. Install node and npm
3. Run command: `npm install`
4. Run command: `node app`
5. Open browser and go to localhost:{port} (Default port: 3000)