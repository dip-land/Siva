let user = null;

module.exports = { 
    add(username, userID){
        user.create({
            username: username,
            userID: userID
        });
    },
    delete(userID){
        user.destroy({
            where: { 
                userID: userID, 
            } 
        })
    },
    async execute(message){
        let result = await this.find(`U${message.author.id}; G${message.guildId};`);
        if(result) {
            if(result.xp >= ((result.level * 1000) * 1.35)) {
                this.update(`U${message.author.id}; G${message.guildId};`, message.author.username, 0, result.level + 1, result.messages + 1);
            } else {
                this.update(`U${message.author.id}; G${message.guildId};`, message.author.username, result.xp + Math.floor(Math.random() * 20) + 10, result.level, result.messages + 1);
            }
        } else {
            this.add(message.author.username, `U${message.author.id}; G${message.guildId};`);
        }
    },
    async find(userID){
        const result = await user.findOne({
            where: { 
                userID: userID,
            } 
        });
        try {
            return result.dataValues;
        } catch (error) {
            return result;
        }
    },
    start(sequelize, Sequelize){
        user = sequelize.define('Users', {
            username: Sequelize.STRING,
            userID: {
                type: Sequelize.STRING,
                unique: true,
            },
            xp: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            level: {
                type: Sequelize.INTEGER,
                defaultValue: 1,
                allowNull: false,
            },
            messages: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
        });
    },
    sync(){
        user.sync();
    },
    update(userID, username, xp, level, messages){
        user.update({ 
            username: username,
            xp: xp, 
            level: level, 
            messages: messages,
        }, 
        { 
            where: { 
                userID: userID, 
            } 
        });
    },
}
