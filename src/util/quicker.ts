import os from 'os'
import config from '../config/config'
export default {
    getSystemHealth: () => {
        // Return a promise that resolves with the system health
        return {
            cpuUsage: os.loadavg(),
            totalMemory: `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
            freeMemory: `${(os.freemem() / 1024 / 1024).toFixed(2)} MB`,
        }
    },

    getApplicationHealth: () => {
        // Return a promise that resolves with the application health
        return {
            environment: config.ENV,
            uptime:  `${process.uptime().toFixed(2)} Seconds`,
            memoryUsage: {
                heapTotal: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
                heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
            }
        }
    }
}