var defaultCtxt;
var listPeople = [];
var paletteLocale;
var currentBrush;

var url = 'ws:' + document.URL.split(':')[1] + ':8080';
var ws = new WebSocket(url);

//Créer les données sur l'utilisateur principal
//Sa palette, son canvas, listeners
function init(data) {
    var nouveauCanvas = document.createElement("canvas");
    nouveauCanvas.id = data.id;
    nouveauCanvas.style.zIndex = 100;
    var ctxt = nouveauCanvas.getContext('2d');

    var palette = {
        id: data.id,
        brush: 'randomWidthPencil',
        context: ctxt,
        point: {
            x: 0,
            y: 0
        },
        lastPoint: {
            x: 0,
            y: 0
        },
        points: [],
        color: '#000000'
    }
    window.addEventListener('resize', function() {

        // save the canvas content as imageURL
        var data = nouveauCanvas.toDataURL();

        nouveauCanvas.setAttribute('width', window.innerWidth);
        nouveauCanvas.setAttribute('height', window.innerHeight - 50);
        // scale and redraw the canvas content
        var img = new Image();
        img.onload = function() {
            ctxt.drawImage(img, 0, 0, img.width, img.height, 0, 0, nouveauCanvas.width, nouveauCanvas.height);
        }
        img.src = data;
    });

    window.dispatchEvent(new Event('resize'));

    var dummyCanvas = document.createElement('canvas');
    defaultCtxt = dummyCanvas.getContext('2d');

    changeBrush(palette);
    nouveauCanvas.addEventListener('mousedown', sendMouseDown);
    nouveauCanvas.addEventListener('mouseup', sendMouseUp);

    var divCanvas = document.querySelector('#canvas');
    divCanvas.appendChild(nouveauCanvas);

    var toutEffacer = document.querySelector('#eraseAll');
    toutEffacer.addEventListener('click', sendErase);

    //On sauvegarde la palette
    listPeople.push(palette);
    paletteLocale = listPeople[0];

    var controls = document.querySelector('#controls');
    controls.addEventListener('click', function(event) {
        var brush = event.target.getAttribute('data-brush');
        if (brush) {
            paletteLocale.brush = brush;
            changeBrush(paletteLocale);
        }
    });

    var colorSelecteur = document.querySelector('#color_input');
    colorSelecteur.addEventListener('change', function(event) {
        var color = colorSelecteur.value;
        if (color) {
            paletteLocale.color = color;
            changeBrush(paletteLocale);
        }
    });

}

//Ajoute un nouvel utilisateur
//Sa palette, son canvas
function createPeople(data) {
    var nouveauCanvas = document.createElement("canvas");
    nouveauCanvas.id = data.id;
    nouveauCanvas.style.zIndex = 10;
    var contexte = nouveauCanvas.getContext('2d');

    window.addEventListener('resize', function() {
        // save the canvas content as imageURL
        var data = nouveauCanvas.toDataURL();

        nouveauCanvas.setAttribute('width', window.innerWidth);
        nouveauCanvas.setAttribute('height', window.innerHeight - 50);
        // scale and redraw the canvas content
        var img = new Image();
        img.onload = function() {
            contexte.drawImage(img, 0, 0, img.width, img.height, 0, 0, nouveauCanvas.width, nouveauCanvas.height);
        }
        img.src = data;
    });

    window.dispatchEvent(new Event('resize'));

    // ajoute l'élément qui vient d'être créé et son contenu au DOM
    var emplacementReference = document.getElementById("canvas");
    emplacementReference.appendChild(nouveauCanvas);

    var pal = {
        id: data.id,
        point: data.point,
        brush: 'randomWidthPencil',
        context: contexte,
        lastPoint: data.point,
        points: [],
        color: '#000000'
    };
    //On ajoute sa palette à la liste des palettes
    listPeople.push(pal);
    changeBrush(pal);

}

// Setup WebSocket

//Notification au serveur du dessin de l'utilisateur
function send(event) {
    var client = paletteLocale.id;
    var points = {
        x: event.pageX,
        y: event.pageY
    };
    var data = {
        type: 'dessin',
        evenement: 'standard',
        point: points,
        brush: paletteLocale.brush,
        id: client,
        color: paletteLocale.color
    };
    ws.send(JSON.stringify(data));
}

//Notification au serveur que l'utilisateur principal a commencé à dessiner
function sendMouseDown(event) {
    var client = paletteLocale.id;
    var points = {
        x: event.pageX,
        y: event.pageY
    };
    var data = {
        type: 'dessin',
        evenement: 'mousedown',
        point: points,
        brush: paletteLocale.brush,
        id: client,
        color: paletteLocale.color
    };
    ws.send(JSON.stringify(data));
}

//Notification au serveur que l'utilisateur principal a arreté de dessiner
function sendMouseUp(event) {
    var client = paletteLocale.id;
    var points = {
        x: event.pageX,
        y: event.pageY
    };
    var data = {
        type: 'dessin',
        evenement: 'mouseup',
        brush: paletteLocale.brush,
        point: points,
        id: client,
        color: paletteLocale.color
    };
    ws.send(JSON.stringify(data));
}

//Notification au serveur que l'utilisateur principal souhaite tout effacer
function sendErase(event) {
    var client = paletteLocale.id;
    var data = {
        id: client,
        type: 'dessin',
        evenement: 'erase',
        brush: paletteLocale.brush
    };
    ws.send(JSON.stringify(data));
}

// Opération de début de tracé
function startDrawing(palette) {
    var canvas = document.getElementById(palette.id);
    canvas.addEventListener('mousemove', send);
    var currentBrush = brushes[palette.brush];
    currentBrush.down(palette);
}

// Opération de fin de tracé
function stopDrawing(palette) {
    var canvas = document.getElementById(palette.id);
    canvas.removeEventListener('mousemove', send);
    var currentBrush = brushes[palette.brush];
    currentBrush.up(palette);
}

// Opération de tracé
function draw(palette) {
    var currentBrush = brushes[palette.brush];
    currentBrush.move(palette);
}

//Met à jour le type de pinceau d'un utilisateur
function changeBrush(palet) {
    var brush = palet.brush;
    var currentBrush = brushes[brush];
    var paletteCourante;
    if (listPeople.length == 0) {
        paletteCourante = palet;
    } else {
        for (p in listPeople) {
            if (palet.id == listPeople[p].id) {
                paletteCourante = listPeople[p];
            }
        }
    }
    paletteCourante.brush = brush;
    restoreDefaults(paletteCourante);
    currentBrush.setup(paletteCourante);
}

//Met à défaut le contexte
function restoreDefaults(palette) {
    var prop = [
        'fillStyle',
        'strokeStyle',
        'globalAlpha',
        'lineWidth',
        'lineJoin',
        'lineCap',
        'shadowBlur',
        'shadowColor',
    ]

    prop.forEach(function(p) {
        palette.context[p] = defaultCtxt[p];
    });
}


// Différents prototypes de pinceau, ils représentent les styles de dessin
// A chaque fois la palette est passé en argument, ainsi l'opération est effectué avec les bonnes données (coordonnées, couleur...) et sur le bon canvas

var brushes = {};

brushes.simplePencil = {
    setup: function(palette) {
        var ctxt = palette.context;
        ctxt.lineWidth = 1;
        ctxt.lineJoin = ctxt.lineCap = 'round';
    },

    down: function(palette) {
        var ctxt = palette.context;
        var point = palette.point;
        ctxt.beginPath();
        ctxt.moveTo(point.x, point.y);
    },

    move: function(palette) {
        var ctxt = palette.context;
        var point = palette.point;
        ctxt.lineTo(point.x, point.y);
        ctxt.stroke();
    },

    up: function(palette) {},
};

brushes.smoothPencil = {
    __proto__: brushes.simplePencil,

    setup: function(palette) {
        var ctxt = palette.context;
        ctxt.lineWidth = 10;
        ctxt.lineJoin = ctxt.lineCap = 'round';
    },
};

brushes.edgeSmoothPencil = {
    __proto__: brushes.smoothPencil,

    setup: function(palette) {
        var ctxt = palette.context;
        ctxt.lineWidth = 3;
        ctxt.lineJoin = ctxt.lineCap = 'round';
        ctxt.shadowBlur = 10;
        ctxt.shadowColor = palette.color;
    },
};

brushes.pointsPencil = {
    __proto__: brushes.simplePencil,

    setup: function(palette) {
        var ctxt = palette.context;
        ctxt.lineWidth = 7;
        ctxt.lineJoin = ctxt.lineCap = 'round';
    },

    down: function(palette) {
        var point = palette.point;
        palette.lastPoint = point;
    },

    move: function(palette) {
        var point = palette.point;
        this.draw(palette);
        palette.lastPoint = point;
    },

    draw: function(palette) {
        var point = palette.point;
        var ctxte = palette.context;
        ctxte.beginPath();
        ctxte.moveTo(palette.lastPoint.x, palette.lastPoint.y);
        ctxte.lineTo(point.x, point.y);
        ctxte.stroke();
    },
};

brushes.gradientPencil = {
    __proto__: brushes.pointsPencil,

    draw: function(palette) {
        var point = palette.point;
        var ctxte = palette.context;
        var gradient = ctxte.createRadialGradient(point.x, point.y, 5,
            point.x, point.y, 10);

        gradient.addColorStop(0, palette.color);
        gradient.addColorStop(0.5, palette.color);
        gradient.addColorStop(1, palette.color);

        ctxte.fillStyle = gradient;
        ctxte.fillRect(point.x - 10, point.y - 10, 20, 20);
    }
}

brushes.interpolatedPencil = {
    __proto__: brushes.gradientPencil,

    move: function(palette) {
        // Polar coordinates
        var point = palette.point;
        var d = utils.distanceBetween(palette.lastPoint, point);
        var th = utils.angleBetween(palette.lastPoint, point);
        var interPoint = {
            x: palette.lastPoint.x,
            y: palette.lastPoint.y
        };
        var step = 3;

        for (var i = step; i < d; i += step) {
            interPoint.x += Math.cos(th) * step;
            interPoint.y += Math.sin(th) * step;
            palette.point = interPoint;
            this.draw(palette);
            palette.lastPoint = interPoint;
        }
        palette.point = point;
        this.draw(palette);
        palette.lastPoint = point;
    }
};

brushes.interpolatedEraser = {
    __proto__: brushes.interpolatedPencil,

    draw: function(palette) {
        var point = palette.point;
        var ctxte = palette.context;
        var gradient = ctxte.createRadialGradient(point.x, point.y, 10,
            point.x, point.y, 20);

        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');

        ctxte.fillStyle = gradient;
        ctxte.fillRect(point.x - 20, point.y - 20, 40, 40);
    },
};

brushes.randomWidthPencil = {
    __proto__: brushes.pointsPencil,

    draw: function(palette) {
        var ctxte = palette.context;
        ctxte.lineWidth = Math.random() * 2 + 3;
        this.__proto__.draw.call(this, palette);
    }
};

brushes.dotsPencil = {
    setup: function() {},
    down: function(palette) {},

    move: function(palette) {
        var ctxt = palette.context;
        var point = palette.point;
        ctxt.beginPath();
        ctxt.arc(point.x, point.y, Math.random() * 15 + 5, false, Math.PI * 2);
        ctxt.fill();
    },

    up: function(palette) {},
};

brushes.trippyDots = {
    __proto__: brushes.dotsPencil,

    setup: function(palette) {
        var ctxt = palette.context;
        ctxt.fillStyle = utils.hueToColor(utils.randomHue());
    },

    move: function(palette) {
        var ctxt = palette.context;
        ctxt.globalAlpha = Math.random();
        this.__proto__.move.call(this, palette);
    },
};

brushes.neighborPointsPencil = {
    __proto__: brushes.pointsPencil,

    setup: function(palette) {
        var ctxt = palette.context;
        ctxt.lineWidth = 1;
        palette.points = [];
    },

    down: function(palette) {
        var point = palette.point;
        palette.points.push(point);
    },

    draw: function(palette) {
        var point = palette.point;
        var ctxte = palette.context;
        palette.points.push(point);

        var p1 = palette.points[palette.points.length - 1];
        var p2 = palette.points[palette.points.length - 2];

        ctxte.beginPath();
        ctxte.moveTo(p2.x, p2.y);
        ctxte.lineTo(p1.x, p1.y);
        ctxte.stroke();

        for (var i = 0, len = palette.points.length; i < len; i++) {
            dx = palette.points[i].x - p1.x;
            dy = palette.points[i].y - p1.y;
            d = dx * dx + dy * dy;

            if (d < 1000) {
                ctxte.beginPath();
                ctxte.moveTo(p1.x + (dx * 0.2), p1.y + (dy * 0.2));
                ctxte.lineTo(palette.points[i].x - (dx * 0.2), palette.points[i].y - (dy * 0.2));
                ctxte.stroke();
            }
        }
    },

    up: function(palette) {
        palette.points.length = 0;
    }
};

//Classe de méthodes utiles
var utils = {
    distanceBetween: function(point1, point2) {
        return Math.sqrt((point1.x - point2.x) * (point1.x - point2.x) + (point1.y - point2.y) * (point1.y - point2.y));
    },
    angleBetween: function(point1, point2) {
        return Math.atan2(point2.y - point1.y, point2.x - point1.x);
    },

    randomHue: function() {
        return Math.floor(Math.random() * 360);
    },

    hueToColor: function(hue) {
        return 'hsl(' + hue + ', 60%, 50%)';
    },

    //Remise à zéro de tous les canvas
    clearCanvas: function() {
        listPeople.forEach(function(p) {
            var canvas = document.getElementById(p.id);
            p.context.clearRect(0, 0, canvas.width, canvas.height);
        });

    },

    // Récupère une palette parmis la liste des palettes existantes en fonction de l'id
    getPalette: function(id) {
        var palette;
        listPeople.forEach(function(p) {
            if (p.id == id) {
                palette = p;
            }
        });
        return palette;
    },
};

// Gestion de réception des données serveur

ws.onopen = function() {
    console.log('CONNECTED TO THE SERVER');
}
ws.onclose = function() {
    console.log('DISCONNECTED OF THE SERVER');
}
ws.onmessage = function(event) {
    //On parse afin d'analyser les données du server
    var datas = JSON.parse(event.data);
    if (datas.type == 'serverInfo') {
        //Ordre du serveur de créer le canvas prédominant (utilisateur principal)
        if (listPeople.length == 0) {
            init(datas);
        }
    } else if (datas.type == 'dessin') {
        var palette;
        //On selectionne la palette de l'acteur de l'action
        palette = utils.getPalette(datas.id);
        //Si elle n'existe pas on la crée
        if (!palette) {
            createPeople(datas);
            palette = utils.getPalette(datas.id);
        }
        //Demande de remise à zéro des canvas
        if (datas.evenement == 'erase') {
            utils.clearCanvas();
        }
        //Ou bien opération de dessin
        else {
            //Mise à jour en fonction des infos reçues du serveur
            if (palette.brush != datas.brush) {
                // On set le type de pinceau de l'action si besoin
                palette.brush = datas.brush;
                changeBrush(palette);
            }
            palette.point = datas.point;
            palette.color = datas.color;
            palette.context.fillStyle = palette.color;
            palette.context.strokeStyle = palette.color;

            // On effectue l'action de l'acteur
            switch (datas.evenement) {
                case 'standard':
                    draw(palette);
                    break;
                case 'mousedown':
                    startDrawing(palette);
                    break;
                case 'mouseup':
                    stopDrawing(palette);
                    break;
            }
        }
    }
}