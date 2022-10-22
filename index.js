/***
 * Draw a canvas it can render players on screen
 */
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

//Global const gravity

const gravity = 0.7;

//Background instance of Sprite class

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./Assets/background.png",
});

//Background decoration named Shop

const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imageSrc: "./Assets/shop.png",
  scale: 2.75,
  framesMax: 6,
});

/**
 * Player and enemy
 */

const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./Assets/samuraiMack/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: "./Assets/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./Assets/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./Assets/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./Assets/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./Assets/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./Assets/samuraiMack/Take hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./Assets/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 160,
    height: 50,
  },
});

console.log(player);

player.draw();

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: "./Assets/kenji/Idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167,
  },
  sprites: {
    idle: {
      imageSrc: "./Assets/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./Assets/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./Assets/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./Assets/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./Assets/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./Assets/kenji/Take hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./Assets/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 170,
    height: 50,
  },
});

enemy.draw();

/**
 * Animation method
 */

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },

  ArrowRight: {
    pressed: false,
  },

  ArrowLeft: {
    pressed: false,
  },
};

/***
 * Invocation of the function being in utils.js
 */

decreaseTimer();

/***
 * Animation function
 */

const animate = () => {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  c.fillStyle = "rgba(255, 255, 255, 0.15)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //PLAYER MOVEMENT

  //movement on X-Axis

  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprites("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprites("run");
  } else {
    player.switchSprites("idle");
  }

  //movement on Y-Axis ( Jumping )

  if (player.velocity.y < 0) {
    player.switchSprites("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprites("fall");
  }

  //ENEMY MOVEMENT

  //movement on X-Axis
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprites("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprites("run");
  } else {
    enemy.switchSprites("idle");
  }

  //movement on Y-Axis ( Jumping )
  if (enemy.velocity.y < 0) {
    enemy.switchSprites("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprites("fall");
  }

  // Detect for collision & gets hit
  // collision player & enemy gets hit
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;
    gsap.to("#enemyHealth", {
      width: enemy.health + "%",
    });
  }

  //if player misses

  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  //collision enemy & player gets hit

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit();
    enemy.isAttacking = false;
    gsap.to("#playerHealth", {
      width: player.health + "%",
    });
  }

  //if enemy misses

  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }

  // ending of the game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
};

animate();

/**
 * Commands input
 */

//Script can handle keys when pressed

window.addEventListener("keydown", (event) => {
  //Player Keys

  if (!player.dead) {
    switch (event.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;

      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;

      case "w":
        if (player.velocity.y == 0) {
          player.velocity.y = -20;
        }
        break;

      case "c":
        player.attack();
        break;
    }
  }

  //Enemy keys

  if (!enemy.dead) {
    switch (event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;

      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;

      case "ArrowUp":
        if (enemy.velocity.y == 0) {
          enemy.velocity.y = -20;
        }
        break;

      case "m":
        enemy.attack();
        break;
    }
  }
});

//Script can handle keys when unpressed

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    //Player keys
    case "d":
      keys.d.pressed = false;
      break;

    case "a":
      keys.a.pressed = false;
      break;

    case "w":
      keys.w.pressed = false;
      break;

    //Enemy keys

    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;

    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
