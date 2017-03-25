// Querty Keyboard Layout

var keyboardCodes = [
    [27,112,113,114,115,116,117,118,119,120,121,122,123],
    [192,49,50,51,52,53,54,55,56,57,48,189,187,8],
    [9,81,87,69,82,84,89,85,73,79,80,219,221,220],
    [20,65,83,68,70,71,72,74,75,76,186,222,13],
    [16,90,88,67,86,66,78,77,188,190,191,16],
    [17, 18, 91, 32, 93, 18, 17]
];

var keyboard = [
    ['esc', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12'],
    [ '`','1','2','3','4','5','6','7','8','9','0','-','=','delete'],
    [ 'tab','q','w','e','r','t','y','u','i','o','p','[',']','\\'],
    [ 'caps','a','s','d','f','g','h','j','k','l', ';','\'','return'],
    [ 'left-shift','z','x','c','v','b','n','m',',','.','/','right-shift'],
    [ 'left-ctrl', 'left-alt', 'left-cmd', 'space', 'cmd', 'right-alt', 'right-ctrl']
];

var shiftkeyboard = [
    ['esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'],
    [ '~','!','@','#','$','%','^','&','*','(',')','_','+','DELETE'],
    [ 'TAB','Q','W','E','R','T','Y','U','I','O','P','{','}','|'],
    [ 'CAPS','A','S','D','F','G','H','J','K','L', ':','"','RETURN'],
    [ 'SHIFT','Z','X','C','V','B','N','M','<','>','?','SHIFT'],
    [ 'ctrl', 'alt', 'cmd', 'SPACE', 'cmd', 'alt', 'ctrl']
];

var idToCharacters = {};

['shift', 'ctrl', 'cmd', 'alt'].forEach(function(a) {
    idToCharacters['left-' + a] = a;
    idToCharacters['right-' + a] = a;
});

function lookupCharacter(a) {
    if (a in idToCharacters) return idToCharacters[a];
    return a;
}

function lookupWidth(c) {
	switch(c) {
        case 'tab': return 70;
        case 'delete': return 70;
        case 'caps': return 80;
        case 'return': return 70;
        case 'shift': return 100;
        case 'reserved': return 100;
        case 'space': return 656 - (50 + 5 )* 6;
        case 'ctrl': return 50;
        case 'cmd': return 50;
        case 'alt': return 50;
        default:
            if (c.match(/f.*/)) return 46;
            return 40;
    }
}

var kx;
var padding = 5;
var ky = 0;
var width = 40;

var i, il, r, rl, row, character, letter;

var keys = {};

for (i=0, il=keyboard.length; i<il; i++) {
    row = keyboard[i]
    for (r=0, rl=row.length; r<rl; r++) {
        character = row[r];

        keys[character] = {
            keycode: keyboardCodes[i][r],
            char: lookupCharacter(character),
            shift: shiftkeyboard[i][r]
        };
    }
}

for (i=0, il=keyboard.length; i<il; i++) {
    row = keyboard[i];
    kx = 0; // padding
    for (r=0, rl=row.length; r<rl; r++) {
        character = row[r];
        key = keys[character];
        key.x = kx;
        key.y = ky;
        key.w = lookupWidth(key.char);
        key.h = width;
        key.h = i == 0 ? 34 : width;

        kx += key.w + padding;
    }

    ky += padding + key.h;
}

var map = {}; // Map of keycode to keys

for (k in keys) {
    key = keys[k];
    if (! (key.keycode in map)) {
        map[key.keycode] = [];
    }

    map[key.keycode].push(key);
}

var keyboard_keys = Object.keys(keys).map(k => Object.assign({ k }, keys[k]));

/*
    Exports
    map,
    keys,
    keyboard_keys
*/