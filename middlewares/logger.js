const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../logs');
const logFile = path.join(logsDir, 'logs.txt');

//crear el directorio si no existe
if(!fs.existsSync(logsDir)){
    fs.mkdirSync(logsDir);
}

const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const logEntry = `${new Intl.DateTimeFormat('es-AR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: false,
                    second: 'numeric',
                    timeZone: 'America/Argentina/Buenos_Aires'
                  }).format(new Date(timestamp))} - ${req.method} - ${req.url}\n`


    fs.appendFile(logFile, logEntry, (err) => {
        if(err){
            console.log('Error escribiendo el archivo...', err);            
        }
    });

    next();
}

module.exports = logger;


