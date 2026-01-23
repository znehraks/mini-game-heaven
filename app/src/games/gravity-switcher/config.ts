import Phaser from 'phaser';

// Game constants
const PLAYER_SIZE = 30;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_GAP = 150;
const INITIAL_SPEED = 200;
const SPEED_INCREASE = 10;
const GRAVITY_STRENGTH = 800;

interface Obstacle extends Phaser.GameObjects.Container {
  passed?: boolean;
}

class GravitySwitcherScene extends Phaser.Scene {
  private player: Phaser.GameObjects.Rectangle | null = null;
  private obstacles: Obstacle[] = [];
  private score = 0;
  private isGameOver = false;
  private isPlaying = false;
  private speed = INITIAL_SPEED;
  private gravityDirection = 1; // 1 = down, -1 = up
  private playerVelocity = 0;
  private scoreText: Phaser.GameObjects.Text | null = null;
  private instructionText: Phaser.GameObjects.Text | null = null;
  private gameOverContainer: Phaser.GameObjects.Container | null = null;
  private obstacleTimer: Phaser.Time.TimerEvent | null = null;
  private trail: Phaser.GameObjects.Rectangle[] = [];

  constructor() {
    super({ key: 'GravitySwitcherScene' });
  }

  create() {
    const { width, height } = this.scale;

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a0f);

    // Create grid lines
    this.createGridLines();

    // Create floor and ceiling
    this.createBoundaries();

    // Create player
    this.createPlayer();

    // Score display
    this.scoreText = this.add
      .text(width / 2, 40, 'SCORE: 0', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '14px',
        color: '#ff00ff',
      })
      .setOrigin(0.5);

    // Instruction text
    this.instructionText = this.add
      .text(width / 2, height / 2, 'TAP TO SWITCH GRAVITY', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '12px',
        color: '#00ffff',
      })
      .setOrigin(0.5);

    // Blinking effect
    this.tweens.add({
      targets: this.instructionText,
      alpha: 0.5,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    // Input handler
    this.input.on('pointerdown', () => this.handleTap());
  }

  private createGridLines() {
    const { width, height } = this.scale;
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x1a1a2a, 0.3);

    for (let x = 0; x < width; x += 40) {
      graphics.moveTo(x, 0);
      graphics.lineTo(x, height);
    }

    for (let y = 0; y < height; y += 40) {
      graphics.moveTo(0, y);
      graphics.lineTo(width, y);
    }

    graphics.strokePath();
  }

  private createBoundaries() {
    const { width, height } = this.scale;

    // Floor
    this.add.rectangle(width / 2, height - 10, width, 20, 0xff00ff, 0.3);

    // Ceiling
    this.add.rectangle(width / 2, 10, width, 20, 0xff00ff, 0.3);
  }

  private createPlayer() {
    const { height } = this.scale;

    this.player = this.add.rectangle(80, height / 2, PLAYER_SIZE, PLAYER_SIZE, 0x00ffff);
    this.player.setStrokeStyle(2, 0xffffff, 0.8);

    // Glow effect
    this.tweens.add({
      targets: this.player,
      alpha: 0.8,
      duration: 300,
      yoyo: true,
      repeat: -1,
    });
  }

  private handleTap() {
    if (this.isGameOver) {
      this.restartGame();
      return;
    }

    if (!this.isPlaying) {
      this.startGame();
      return;
    }

    // Switch gravity
    this.gravityDirection *= -1;
    this.playerVelocity = -200 * this.gravityDirection;

    // Visual feedback - flash player
    if (this.player) {
      this.player.setFillStyle(this.gravityDirection === 1 ? 0x00ffff : 0xff00ff);
    }

    // Add trail effect
    this.addTrailParticle();
  }

  private addTrailParticle() {
    if (!this.player) return;

    const particle = this.add.rectangle(
      this.player.x,
      this.player.y,
      PLAYER_SIZE * 0.6,
      PLAYER_SIZE * 0.6,
      this.player.fillColor as number,
      0.5
    );

    this.trail.push(particle);

    this.tweens.add({
      targets: particle,
      alpha: 0,
      scale: 0.3,
      duration: 300,
      onComplete: () => {
        particle.destroy();
        this.trail = this.trail.filter((p) => p !== particle);
      },
    });
  }

  private startGame() {
    this.isPlaying = true;

    if (this.instructionText) {
      this.instructionText.setVisible(false);
    }

    // Start spawning obstacles
    this.obstacleTimer = this.time.addEvent({
      delay: 1500,
      callback: this.spawnObstacle,
      callbackScope: this,
      loop: true,
    });

    // Spawn first obstacle
    this.spawnObstacle();
  }

  private spawnObstacle() {
    if (this.isGameOver) return;

    const { width, height } = this.scale;
    const gapY = Phaser.Math.Between(100, height - 100);
    const gapSize = OBSTACLE_GAP - Math.min(this.score * 2, 50); // Gap shrinks with score

    const container = this.add.container(width + OBSTACLE_WIDTH, 0) as Obstacle;

    // Top obstacle
    const topHeight = gapY - gapSize / 2 - 20;
    if (topHeight > 0) {
      const top = this.add.rectangle(0, topHeight / 2 + 20, OBSTACLE_WIDTH, topHeight, 0x8b5cf6);
      top.setStrokeStyle(2, 0xffffff, 0.3);
      container.add(top);
    }

    // Bottom obstacle
    const bottomHeight = height - 20 - (gapY + gapSize / 2);
    if (bottomHeight > 0) {
      const bottom = this.add.rectangle(
        0,
        height - bottomHeight / 2 - 20,
        OBSTACLE_WIDTH,
        bottomHeight,
        0x8b5cf6
      );
      bottom.setStrokeStyle(2, 0xffffff, 0.3);
      container.add(bottom);
    }

    container.passed = false;
    this.obstacles.push(container);
  }

  private gameOver() {
    this.isGameOver = true;
    this.isPlaying = false;

    if (this.obstacleTimer) {
      this.obstacleTimer.destroy();
    }

    // Flash effect
    this.cameras.main.flash(200, 255, 0, 255);
    this.cameras.main.shake(200, 0.01);

    // Show game over UI
    const { width, height } = this.scale;

    this.gameOverContainer = this.add.container(width / 2, height / 2);

    const bg = this.add.rectangle(0, 0, 280, 180, 0x0a0a0f, 0.95);
    bg.setStrokeStyle(2, 0xff00ff);

    const gameOverText = this.add
      .text(0, -50, 'GAME OVER', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '20px',
        color: '#ff00ff',
      })
      .setOrigin(0.5);

    const finalScoreText = this.add
      .text(0, 0, `SCORE: ${this.score}`, {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '14px',
        color: '#00ffff',
      })
      .setOrigin(0.5);

    const restartText = this.add
      .text(0, 50, 'TAP TO RETRY', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '12px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: restartText,
      alpha: 0.3,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    this.gameOverContainer.add([bg, gameOverText, finalScoreText, restartText]);

    this.gameOverContainer.setScale(0);
    this.tweens.add({
      targets: this.gameOverContainer,
      scale: 1,
      duration: 300,
      ease: 'Back.out',
    });

    this.emitScore();
  }

  private emitScore() {
    window.dispatchEvent(
      new CustomEvent('gameScore', {
        detail: { score: this.score, gameId: 'gravity-switcher' },
      })
    );
  }

  private restartGame() {
    // Clean up
    this.obstacles.forEach((o) => o.destroy());
    this.obstacles = [];
    this.trail.forEach((t) => t.destroy());
    this.trail = [];

    if (this.gameOverContainer) {
      this.gameOverContainer.destroy();
      this.gameOverContainer = null;
    }

    // Reset state
    this.score = 0;
    this.speed = INITIAL_SPEED;
    this.isGameOver = false;
    this.isPlaying = false;
    this.gravityDirection = 1;
    this.playerVelocity = 0;

    // Reset player position
    if (this.player) {
      this.player.setPosition(80, this.scale.height / 2);
      this.player.setFillStyle(0x00ffff);
    }

    // Reset score text
    if (this.scoreText) {
      this.scoreText.setText('SCORE: 0');
    }

    // Show instruction
    if (this.instructionText) {
      this.instructionText.setVisible(true);
    }
  }

  update(_time: number, delta: number) {
    if (!this.isPlaying || this.isGameOver || !this.player) return;

    const deltaSeconds = delta / 1000;
    const { height } = this.scale;

    // Apply gravity
    this.playerVelocity += GRAVITY_STRENGTH * this.gravityDirection * deltaSeconds;
    this.player.y += this.playerVelocity * deltaSeconds;

    // Boundary collision
    const minY = 20 + PLAYER_SIZE / 2;
    const maxY = height - 20 - PLAYER_SIZE / 2;

    if (this.player.y < minY || this.player.y > maxY) {
      this.gameOver();
      return;
    }

    // Move obstacles
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obstacle = this.obstacles[i];
      if (!obstacle) continue;

      obstacle.x -= this.speed * deltaSeconds;

      // Check if passed
      if (!obstacle.passed && obstacle.x < this.player.x) {
        obstacle.passed = true;
        this.score++;
        this.speed += SPEED_INCREASE;

        if (this.scoreText) {
          this.scoreText.setText(`SCORE: ${this.score}`);
          this.tweens.add({
            targets: this.scoreText,
            scale: 1.2,
            duration: 100,
            yoyo: true,
          });
        }
      }

      // Remove off-screen obstacles
      if (obstacle.x < -OBSTACLE_WIDTH) {
        obstacle.destroy();
        this.obstacles.splice(i, 1);
        continue;
      }

      // Collision detection
      if (this.checkCollision(obstacle)) {
        this.gameOver();
        return;
      }
    }
  }

  private checkCollision(obstacle: Obstacle): boolean {
    if (!this.player) return false;

    const playerBounds = {
      left: this.player.x - PLAYER_SIZE / 2,
      right: this.player.x + PLAYER_SIZE / 2,
      top: this.player.y - PLAYER_SIZE / 2,
      bottom: this.player.y + PLAYER_SIZE / 2,
    };

    const obstacleBounds = {
      left: obstacle.x - OBSTACLE_WIDTH / 2,
      right: obstacle.x + OBSTACLE_WIDTH / 2,
    };

    // Check horizontal overlap first
    if (playerBounds.right < obstacleBounds.left || playerBounds.left > obstacleBounds.right) {
      return false;
    }

    // Check collision with each rectangle in the container
    const children = obstacle.getAll() as Phaser.GameObjects.Rectangle[];
    for (const child of children) {
      const rect = child.getBounds();
      if (
        playerBounds.left < rect.right &&
        playerBounds.right > rect.left &&
        playerBounds.top < rect.bottom &&
        playerBounds.bottom > rect.top
      ) {
        return true;
      }
    }

    return false;
  }
}

const config: Partial<Phaser.Types.Core.GameConfig> = {
  scene: [GravitySwitcherScene],
};

export default config;
