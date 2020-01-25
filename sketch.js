const FRAMES_PER_EPISODE = 65;

let episodes, currentEpisode, lastEpisode, house;
let members = [];

function preload() {
  episodes = loadTable('season-data.csv', 'csv', 'header').getRows();
}

function setup() {
  // Create the canvas
  //frameRate(10);
  createCanvas(windowWidth, windowHeight);

  let desktop = true;
  if (desktop) {
    dimens = {
      textSize: 32,
      topStep: 50,
    }
  } else {

  }

  // Start off from the 0th episode (so that entrances trigger on the transition to 1)
  currentEpisode = { number: 0, members: [] };
  lastEpisode = currentEpisode;

  // Create the house
  house = new House();
  for (let i = 0; i < 6; i++) {
    members.push(new Member());
  }
}

function draw() {
  // Figure out the right current episode
  episodeCounter = str(int(frameCount / FRAMES_PER_EPISODE));

  // Check if its time for the next episode
  if (episodeCounter > 0 &&
      episodeCounter != int(currentEpisode.number) &&
      episodeCounter <= episodes.length) {
    // Transition the episode
    lastEpisode = currentEpisode;
    currentEpisode = episodes[episodeCounter - 1].obj;

    // Display next episode infp
    let memberNames = currentEpisode.members.split(';').join(', ');
    print("Next episode", currentEpisode.number, '--', memberNames);
  }

  // Check if the episode has changed
  if (currentEpisode.number != lastEpisode.number) {
  }

  // Color the background
  background('white');
  house.display();

  // Draw the title
  if (int(currentEpisode.number) > 0) {
    textSize(dimens.textSize);
    textStyle(NORMAL);
    textAlign(CENTER);
    text('Episode ' + currentEpisode.number, width / 2, dimens.topStep * 2);

    textStyle(ITALIC);
    text(currentEpisode.title, width / 2, 150);

    // Move and draw the members
    for (let i = 0; i < members.length; i++) {
      members[i].move();
      members[i].display();
    }
  } else {
    // Display the title
    textSize(50);
    textStyle(NORMAL);
    textAlign(CENTER);
    text('TERRACE BOX', width / 2, height / 2);
  }
}

class House {
  constructor() {
    this.topLeft = {
      x: width / 4,
      y: height / 4
    };

    this.width = width / 2;
    this.height = height / 2;
  }

  display() {
    rect(this.topLeft.x, this.topLeft.y, this.width, this.height);
  }

  contains(x, y, radius) {
    return [
      (x - radius) > this.topLeft.x,
      (x + radius) < (this.topLeft.x + this.width),
      (y - radius) > this.topLeft.y,
      (y + radius) < (this.topLeft.y + this.height),
    ].every(x => x)
  }
}

class Member {
  constructor(name) {
    this.name = name;

    // Initialize characteristics
    this.speed = 3;
    this.diameter = random(15, 30);
    this.radius = this.diameter / 2;

    // Initialize position in the house
    this.x = random(house.topLeft.x + this.radius,
                    house.topLeft.x - this.radius + house.width);
    this.y = random(house.topLeft.y + this.radius,
                    house.topLeft.y - this.radius + house.height);
  }

  move() {
    let new_x = this.x + random(-this.speed, this.speed);
    let new_y = this.y + random(-this.speed, this.speed);

    // Only move to the new position if its in the house
    if (house.contains(new_x, new_y, this.radius)) {
      this.x = new_x;
      this.y = new_y;
    }
  }

  display() {
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }
}
