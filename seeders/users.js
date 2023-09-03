module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('User', [{
            name: 'admin',
            email: 'admin@scadiota.com',
            password: '8cb2237d0679ca88db6464eac60da96345513964',
            document:'123456789',
            state:'ENABLED',
            role:'ADMIN'
        }]);
    },down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('User', { email: 'admin@scadiota.com' }, {});
    }
};