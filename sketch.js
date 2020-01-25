const FRAMES_PER_EPISODE = 30;

let episodes, currentEpisode, lastEpisode, house;
let currentMembers = {};

function preload() {
  episodes = loadTable('season-data.csv', 'csv', 'header').getRows();
}

function setup() {
  // Create the canvas
  //frameRate(10);
  createCanvas(windowWidth, windowHeight);

  let desktop = width > 500;
  if (desktop) {
    dimens = {
      titleSize: 60,
      headerSize: 32,
      subheaderSize: 27,
      nameSize: 20,
      topStep: 42,
    }
    house = new House(0.5 * width, 0.55 * height);
  } else {
    dimens = {
      titleSize: 30,
      headerSize: 22,
      subheaderSize: 20,
      nameSize: 18,
      topStep: 36,
    }
    house = new House(0.7 * width, 0.5 * height);
  }

  // Start off from the 0th episode (so that entrances trigger on the transition to 1)
  currentEpisode = { number: 0, members: [] };
  lastEpisode = currentEpisode;
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

    // Clean up the episode data
    currentEpisode.members = currentEpisode.members.split(';');
    print("Next episode", currentEpisode.number, '--', currentEpisode.members.join(', '));

    // Add new members
    currentEpisode.members.forEach((memberName) => {
      if (! Object.keys(currentMembers).includes(memberName)) {
        currentMembers[memberName] = new Member(memberName);
      }
    });

    // Have members leave
    Object.values(currentMembers).forEach((member) => {
      if (! currentEpisode.members.includes(member.name)) {
        delete currentMembers[member.name];
      }
    });
  }

  // Draw the house
  background('white');
  house.display();

  if (int(currentEpisode.number) > 0) {
    // Display the episode number
    textSize(dimens.headerSize);
    textStyle(BOLD);
    textAlign(CENTER, BOTTOM);
    text('Terrace House: Boys x Girls Next Door', width / 2, dimens.topStep * 1.6);

    // Display the episode number
    textSize(dimens.subheaderSize);
    textStyle(NORMAL);
    textAlign(CENTER, BOTTOM);
    text('Episode ' + currentEpisode.number, width / 2, dimens.topStep * 3);

    // Display the episode number and title
    textSize(dimens.headerSize);
    textStyle(ITALIC);
    text(currentEpisode.title, width / 2, dimens.topStep * 4);

    drawMembers();
  } else {
    // Display the title
    textSize(dimens.titleSize);
    textStyle(NORMAL);
    textAlign(CENTER, CENTER);
    text('TERRACE BOX', width / 2, height / 2 + dimens.topStep);
  }
}

function drawMembers() {
  Object.values(currentMembers).forEach((member) => {
    member.move();
    member.display();
  });
}

class House {
  constructor(houseWidth, houseHeight) {
    this.topLeft = {
      x: (width - houseWidth) / 2,
      y: ((height - houseHeight) / 2) + dimens.topStep
    };

    this.width = houseWidth;
    this.height = houseHeight;
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
    this.speed = 2;
    this.diameter = 50;
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
    textSize(dimens.nameSize)
    textStyle(NORMAL);
    textAlign(CENTER, TOP);
    text(this.name, this.x, this.y + this.radius);
  }
}
