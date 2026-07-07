const login = require("../Login.json");

module.exports = {

    async player(playerId) {

        const response = await fetch(
            `${login.MisfitzAPI}/api/player/Player:${playerId}`
        );

        const data = await response.json();

        if (!response.ok) {

            const error = new Error(
                data.error || `HTTP ${response.status}`
            );

            error.status = response.status;
            error.apiData = data;

            throw error;
        }

        return data;

    }

};