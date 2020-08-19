const Intl = require('intl');

module.exports = {
    age(timestamp) {
        
        const today = new Date();
        const birthDate = new Date(timestamp);
    
        // Ano: 2019 - 1985 = 34
        let age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth() - birthDate.getMonth();
    
        // Mês: 11 - 12 = -1
        // Mês: 11 - 11 = 0
        if (month < 0 ||
            month == 0 &&
            today.getDate() <= birthDate.getDate()) {
                age = age - 1;
        }
    
        return age;
    },

    date(timestamp) {
        const date = new Date(timestamp);

        const year = date.getFullYear();
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);
        const hour = date.getHours();
        const minutes = date.getMinutes();

        return {
            day,
            month,
            year,
            hour,
            minutes,
            iso: `${year}-${month}-${day}`,
            format: `${day}/${month}/${year}`
        }
    },

    birthDay(timestamp) {

        const date = new Date(timestamp);

        const year = date.getFullYear();
        const month = `0${date.getUTCMonth() + 1}`.slice(-2);
        const day = `0${date.getUTCDate()}`.slice(-2);

        // Padrão de data no HTML: yyyy-mm-dd
        return {
            day,
            month,
            year,
            iso: `${day}/${month}`,
            birthDate: `${month}/${year}`,
            format: `${day}/${month}/${year}`
        };
    },

    formatPrice(price) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price/100);
    }
}