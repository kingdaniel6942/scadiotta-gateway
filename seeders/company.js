module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Company', [{
            name: 'My Company',
            nit: '000111222',
            state: 'ENABLED'
        }]);
    },down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Company', { nit: '000111222' }, {});
    }
};