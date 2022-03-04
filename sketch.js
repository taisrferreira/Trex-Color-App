var PLAY = 1;
var END = 0;
var gameState = PLAY;

var score=0;

var backgroundImg;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var gameOver, restart;
var jumpSound, collidedSound;

function preload() {
  jumpSound = loadSound("assets/sounds/jump.wav");
  collidedSound = loadSound("assets/sounds/collided.wav");
  
  backgroundImg = loadImage("assets/backgroundImg.png");
  sunAnimation = loadImage("assets/sun.png");
  
  trex_running = loadAnimation("assets/trex_2.png","assets/trex_1.png","assets/trex_3.png");
  trex_collided = loadAnimation("assets/trex_collided.png");
  
  groundImage = loadImage("assets/ground.png");  
  cloudImage = loadImage("assets/cloud.png");
  
  obstacle1 = loadImage("assets/obstacle1.png");
  obstacle2 = loadImage("assets/obstacle2.png");
  obstacle3 = loadImage("assets/obstacle3.png");
  obstacle4 = loadImage("assets/obstacle4.png");
  
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  sun = createSprite(width-50,100,10,10);
  sun.addAnimation("sun", sunAnimation);
  sun.scale = 0.1
  
  trex = createSprite(50,height-70,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.setCollider('circle',0,0,350);
  trex.scale = 0.08;
  
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  trex.debug = false;
  score = 0;
}

function draw() {
  background(backgroundImg);

  textSize(20);
  fill("black")
  text("Score: "+ score,30,50);  
  
  if (gameState===PLAY) {
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    if((touches.length > 0 || keyDown("SPACE")) && trex.y  >= height-120) {
      jumpSound.play();
      trex.velocityY = -10;
      touches = [];
    }
    
    trex.velocityY = trex.velocityY + 0.8;
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);

    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
      collidedSound.play();
      gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    trex.changeAnimation("collided",trex_collided);
    
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = [];
    }
  }  
  
  drawSprites();
}

function spawnClouds() {
  
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
    cloud.lifetime = 300;

    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;

    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,height-95,20,30);
    obstacle.setCollider('circle',0,0,45)
  
    obstacle.velocityX = -(6 + 3*score/100);
    
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default:break;
    }
         
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    obstacle.depth = trex.depth;
    trex.depth +=1;

    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  score = 0;  
}
