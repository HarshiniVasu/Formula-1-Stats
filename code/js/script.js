d3.json('data/world.json').then(world => {

        const worldMap = new Map();
        worldMap.drawMap(world);

});