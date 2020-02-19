# LSCweb

## Core server
1. Go to folder `Luon_working/LSCServer/lifelog_retrieval`
2. Activate environment and run command: `python app.py`
3. Run command: `ssh -N -L 5000:127.0.0.1:5000 anhkhoa@10.10.2.13`

## Dynamic website
1. Extract `lsc2020.zip` and move extracted folder to `public/dataset`
2. Install node and npm
3. Run command: `npm install`
4. Run command: `node app`
5. Open browser and go to localhost:{port} (Default port: 3000)