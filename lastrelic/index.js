/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

import PogObject from "PogData";

let boss = false;
let lastrelic = null;
let gui = new Gui();
let data = new PogObject("lastrelic", {
  x: 0,
  y: 0,
  display: true,
  first_time: true
}, ".data.json")

if(data.first_time) {
  ChatLib.chat("&b[LastRelic] &fDo /relic for setup!")
  data.first_time = false;
  data.save();
}

register("command", (...args) => {
  if(args[0] == "toggle") {
    data.display = !data.display;
    data.save();
    ChatLib.chat("&b[LastRelic] &fDisplay set to " + data.display);
  } else {
    gui.open();
    ChatLib.chat(`&b[LastRelic] &fOpened GUI! Do /relic toggle to ${!data.display ? "show" : "hide"} display!`)
  }
}).setName("relic").setAliases(["lastrelic"]);

register("renderOverlay", () => {
  if(!gui.isOpen() && (!data.display || !boss || lastrelic==null)) return;

  if(gui.isOpen()) {
    Renderer.drawStringWithShadow("Click anywhere to move!", Renderer.screen.getWidth()/2 - Renderer.getStringWidth("Click anywhere to move!")/2, Renderer.screen.getHeight()/2)
  }
  Renderer.drawStringWithShadow("Last Relic: " + lastrelic, data.x, data.y);
})

register("dragged", (dx, dy, x, y) => {
  if(!gui.isOpen()) return;
  data.x = x;
  data.y = y;
  data.save();
})

register("chat", () => {
  boss = true;
}).setCriteria(/\[BOSS\] Necron: .+/);

register("worldLoad", () => {
  boss = false;
})

register("chat", (player, color) => {
  if(!boss||player.length>16||Player.getName()!=player) return;
  lastrelic = color;
  switch(color.toLowerCase()) {
    case "red":
      lastrelic = "&c" + lastrelic;
      break;
    case "blue":
      lastrelic = "&b" + lastrelic;
      break;
    case "green":
      lastrelic = "&a" + lastrelic;
      break;
    case "orange":
      lastrelic = "&6" + lastrelic;
      break;
    case "purple":
      lastrelic = "&d" + lastrelic;
      break;
  }
}).setCriteria(/(.+) picked up the Corrupted (\w+) Relic!/)
