
export const EnvConfiguration =()=>({
    enviroment: process.env.NODE_ENV || 'dev',
    mongoUrl: process.env.MONGO_URL,
    port: process.env.PORT || 3001,
    defaultLimit: +process.env.defaultLimite || 7
})