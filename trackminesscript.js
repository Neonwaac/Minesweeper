//This is a little script to know the mines position
for (let i = 0; i < mines; i++) {
    let id = Math.floor(Math.random() * notminesLocation.length);
    let minePosition = notminesLocation.splice(id, 1)[0];
    minesLocation.push(minePosition);
}
console.log(notminesLocation)