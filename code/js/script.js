function openTab(event, tabName) {

    let tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    let tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    event.currentTarget.className += " active";
}

document.getElementById("defaultOpen").click();

d3.json('data/world.json').then(world => {

        const worldMap = new Map();
        worldMap.drawMap(world);
        const teamObj = new Teams();
        //teamObj.drawYearBar();
});

