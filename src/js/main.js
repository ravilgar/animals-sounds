var game = new Phaser.Game(640, 360, Phaser.AUTO, 'game');

var GameState = {
    // Загружаем все необходимые элементы игры
    preload: function () {
        this.load.image('background', 'assets/images/landscape.png');

        this.load.image('rabbit', 'assets/images/animals/rabbit-200-200.png');
        this.load.image('moose', 'assets/images/animals/moose-200-200.png');
        this.load.image('sheep', 'assets/images/animals/sheep-200-200.png');

        this.load.audio('rabbitSound', ['assets/sounds/rabbit.ogg', 'assets/sounds/rabbit.mp3']);
        this.load.audio('mooseSound', ['assets/sounds/moose.ogg', 'assets/sounds/moose.mp3']);
        this.load.audio('sheepSound', ['assets/sounds/sheep.ogg', 'assets/sounds/sheep.mp3']);

        this.load.image('arrow', 'assets/images/direction-right.png');
    },
    // Выполняем один раз, когда все элементы подгружены
    create: function () {
        // добавляем responsible featchers
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        // создаем sprite для фона
        this.background = this.game.add.sprite(0, 0, 'background');

        // группа животных
        var animalData = [
            {
                key: 'rabbit',
                text: 'RABBIT',
                audio: 'rabbitSound'
            },
            {
                key: 'moose',
                text: 'MOOSE',
                audio: 'mooseSound'
            },
            {
                key: 'sheep',
                text: 'SHEAP',
                audio: 'sheepSound'
            }
        ];

        this.animals = this.game.add.group();
        // чтобы обращаться внутри метода forEach
        var self = this;
        // чтобы обращаться за пределами forEach
        var animal;
        // анимация выбранного животного
        animalData.forEach(function (element) {
            // располагаем файл по центру world, и смещаем на 1000px влево, чтобы убрать с экрана
            animal = self.animals.create(self.game.world.centerX - 1000, self.game.world.centerY, element.key);

            animal.customParams = {
                text: element.text,
                sound: self.game.add.audio(element.audio)
            };

            // выравниваем картинку по центру относительно самой себя: ширина, высота
            animal.anchor.setTo(0.5, 0.5);

            animal.inputEnabled = true;
            animal.input.pixelPerfectClick = true;
            animal.events.onInputDown.add(self.animateAnimal, self);
        });

        // устанавливаем текущее животное по центру
        this.currentAnimal = this.animals.next();
        this.currentAnimal.position.set(this.game.world.centerX, this.game.world.centerY);

        // показываем текст
        this.showText(this.currentAnimal);

        // прокрутка влево
        this.leftArrow = this.game.add.sprite(110, this.game.world.centerY, "arrow");
        this.leftArrow.anchor.setTo(0.5, 0.5);
        this.leftArrow.scale.setTo(-1, 1);
        this.leftArrow.customParams = {
            direction: -1
        };
        // user input
        this.leftArrow.inputEnabled = true;
        this.leftArrow.input.pixelPerfectClick = true;
        this.leftArrow.events.onInputDown.add(this.switchAnimal, this);

        // прокрутка вправо
        this.rightArrow = this.game.add.sprite(530, this.game.world.centerY, "arrow");
        this.rightArrow.anchor.setTo(0.5, 0.5);
        this.rightArrow.customParams = {
            direction: 1
        };
        // user input
        this.rightArrow.inputEnabled = true;
        this.rightArrow.input.pixelPerfectClick = true;
        this.rightArrow.events.onInputDown.add(this.switchAnimal, this);
    },
    // Выполняем постоянно, несколько раз в секунду
    update: function () {

    },
    switchAnimal: function (sprite, event) {
        if (this.isMoving) {
            return false;
        }

        this.isMoving = true;

        // скрываем текст
        this.animalText.visible = false;

        var newAnimal, endX;

        if (sprite.customParams.direction === 1) {
            newAnimal = this.animals.next();
            newAnimal.x = -newAnimal.width / 2;
            endX = this.game.world.width + this.currentAnimal.width / 2;
        } else {
            newAnimal = this.animals.previous();
            newAnimal.x = this.game.world.width + newAnimal.width / 2;
            endX = -this.currentAnimal.width / 2;
        }

        var newAnimalMovement = game.add.tween(newAnimal);
        newAnimalMovement.to({
            x: this.game.world.centerX
        }, 1000);
        newAnimalMovement.onComplete.add(function () {
            this.isMoving = false;
            this.showText(newAnimal);
        }, this);
        newAnimalMovement.start();

        var currentAnimalMovement = game.add.tween(this.currentAnimal);
        currentAnimalMovement.to({
            x: endX
        }, 1000);
        currentAnimalMovement.start();

        this.currentAnimal = newAnimal;
    },
    animateAnimal: function (sprite, event) {
        sprite.customParams.sound.play();
    },
    showText: function (animal) {
        if (!this.animalText) {
            var style = {
                font: 'bold 35pt Arial',
                fill: '#c0392b',
                align: 'center'
            };
            this.animalText = this.game.add.text(this.game.width / 2, this.game.height * 0.85, '', style);
            this.animalText.anchor.setTo(0.5);
        }
        this.animalText.setText(animal.customParams.text);
        this.animalText.visible = true;
    }
};

game.state.add('GameState', GameState);
game.state.start('GameState');