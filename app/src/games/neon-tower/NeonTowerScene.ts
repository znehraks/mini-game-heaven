import Phaser from 'phaser';

// Game constants
const BLOCK_HEIGHT = 30;
const INITIAL_BLOCK_WIDTH = 200;
const BLOCK_SPEED = 200;
const COLORS = [0xff00ff, 0x00ffff, 0x8b5cf6, 0xfbbf24, 0x22c55e];

interface Block extends Phaser.GameObjects.Rectangle {
  direction: number;
}

export class NeonTowerScene extends Phaser.Scene {
  private blocks: Block[] = [];
  private currentBlock: Block | null = null;
  private score = 0;
  private isGameOver = false;
  private baseY = 0;
  private scoreText: Phaser.GameObjects.Text | null = null;
  private instructionText: Phaser.GameObjects.Text | null = null;
  private gameOverContainer: Phaser.GameObjects.Container | null = null;

  constructor() {
    super({ key: 'NeonTowerScene' });
  }

  create() {
    const { width, height } = this.scale;

    // Set base position
    this.baseY = height - 100;

    // Create background gradient effect
    this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a0f);

    // Add grid lines for visual effect
    this.createGridLines();

    // Create the first (base) block
    this.createBaseBlock();

    // Create score display
    this.scoreText = this.add
      .text(width / 2, 40, 'SCORE: 0', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '14px',
        color: '#00ffff',
      })
      .setOrigin(0.5);

    // Create instruction text
    this.instructionText = this.add
      .text(width / 2, height / 2, 'TAP TO START', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '16px',
        color: '#ff00ff',
      })
      .setOrigin(0.5);

    // Add glow effect to instruction
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

    // Vertical lines
    for (let x = 0; x < width; x += 40) {
      graphics.moveTo(x, 0);
      graphics.lineTo(x, height);
    }

    // Horizontal lines
    for (let y = 0; y < height; y += 40) {
      graphics.moveTo(0, y);
      graphics.lineTo(width, y);
    }

    graphics.strokePath();
  }

  private createBaseBlock() {
    const { width } = this.scale;
    const color = Phaser.Utils.Array.GetRandom(COLORS);

    const block = this.add.rectangle(
      width / 2,
      this.baseY,
      INITIAL_BLOCK_WIDTH,
      BLOCK_HEIGHT,
      color
    ) as Block;

    block.setStrokeStyle(2, 0xffffff, 0.5);
    block.direction = 1;

    // Add glow effect
    this.addBlockGlow(block, color);

    this.blocks.push(block);
  }

  private createMovingBlock() {
    if (this.isGameOver) return;

    const lastBlock = this.blocks[this.blocks.length - 1];
    if (!lastBlock) return;

    const color = Phaser.Utils.Array.GetRandom(COLORS);
    const newY = lastBlock.y - BLOCK_HEIGHT;

    // Start from left side
    const block = this.add.rectangle(0, newY, lastBlock.width, BLOCK_HEIGHT, color) as Block;

    block.setStrokeStyle(2, 0xffffff, 0.5);
    block.direction = 1;

    // Add glow effect
    this.addBlockGlow(block, color);

    this.currentBlock = block;

    // Hide instruction
    if (this.instructionText) {
      this.instructionText.setVisible(false);
    }

    // Move camera up if needed
    if (newY < this.scale.height * 0.4) {
      this.scrollCamera();
    }
  }

  private addBlockGlow(block: Phaser.GameObjects.Rectangle, _color: number) {
    // Simple glow using alpha tweening (color reserved for future glow effect)
    this.tweens.add({
      targets: block,
      alpha: 0.8,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });
  }

  private scrollCamera() {
    // Move all blocks down
    const moveAmount = BLOCK_HEIGHT * 5;

    this.blocks.forEach((block) => {
      this.tweens.add({
        targets: block,
        y: block.y + moveAmount,
        duration: 300,
        ease: 'Power2',
      });
    });

    if (this.currentBlock) {
      this.tweens.add({
        targets: this.currentBlock,
        y: this.currentBlock.y + moveAmount,
        duration: 300,
        ease: 'Power2',
      });
    }

    this.baseY += moveAmount;
  }

  private handleTap() {
    if (this.isGameOver) {
      this.restartGame();
      return;
    }

    if (!this.currentBlock) {
      // Start the game
      this.createMovingBlock();
      return;
    }

    // Place the current block
    this.placeBlock();
  }

  private placeBlock() {
    if (!this.currentBlock) return;

    const lastBlock = this.blocks[this.blocks.length - 1];
    if (!lastBlock) return;

    // Calculate overlap
    const currentLeft = this.currentBlock.x - this.currentBlock.width / 2;
    const currentRight = this.currentBlock.x + this.currentBlock.width / 2;
    const lastLeft = lastBlock.x - lastBlock.width / 2;
    const lastRight = lastBlock.x + lastBlock.width / 2;

    const overlapLeft = Math.max(currentLeft, lastLeft);
    const overlapRight = Math.min(currentRight, lastRight);
    const overlapWidth = overlapRight - overlapLeft;

    if (overlapWidth <= 0) {
      // Game over - no overlap
      this.gameOver();
      return;
    }

    // Create the placed block with correct size
    const placedBlock = this.add.rectangle(
      overlapLeft + overlapWidth / 2,
      this.currentBlock.y,
      overlapWidth,
      BLOCK_HEIGHT,
      this.currentBlock.fillColor
    ) as Block;

    placedBlock.setStrokeStyle(2, 0xffffff, 0.5);
    placedBlock.direction = 1;

    // Add glow
    this.addBlockGlow(placedBlock, this.currentBlock.fillColor as number);

    // Create falling piece if any
    const leftOverhang = lastLeft - currentLeft;
    const rightOverhang = currentRight - lastRight;

    if (leftOverhang > 0) {
      this.createFallingPiece(
        currentLeft + leftOverhang / 2,
        this.currentBlock.y,
        leftOverhang,
        this.currentBlock.fillColor as number
      );
    }

    if (rightOverhang > 0) {
      this.createFallingPiece(
        lastRight + rightOverhang / 2,
        this.currentBlock.y,
        rightOverhang,
        this.currentBlock.fillColor as number
      );
    }

    // Destroy the moving block
    this.currentBlock.destroy();
    this.currentBlock = null;

    // Add to blocks array
    this.blocks.push(placedBlock);

    // Update score
    this.score++;
    if (this.scoreText) {
      this.scoreText.setText(`SCORE: ${this.score}`);

      // Score pop animation
      this.tweens.add({
        targets: this.scoreText,
        scale: 1.2,
        duration: 100,
        yoyo: true,
      });
    }

    // Check for perfect placement bonus
    if (Math.abs(overlapWidth - lastBlock.width) < 5) {
      this.showPerfectBonus();
    }

    // Create next block
    this.time.delayedCall(100, () => this.createMovingBlock());
  }

  private createFallingPiece(x: number, y: number, width: number, color: number) {
    const piece = this.add.rectangle(x, y, width, BLOCK_HEIGHT, color);
    piece.setAlpha(0.7);

    this.tweens.add({
      targets: piece,
      y: this.scale.height + 100,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => piece.destroy(),
    });
  }

  private showPerfectBonus() {
    const { width, height } = this.scale;

    const perfectText = this.add
      .text(width / 2, height / 2, 'PERFECT!', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '24px',
        color: '#fbbf24',
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: perfectText,
      y: perfectText.y - 50,
      alpha: 0,
      scale: 1.5,
      duration: 800,
      onComplete: () => perfectText.destroy(),
    });

    // Bonus score
    this.score += 5;
    if (this.scoreText) {
      this.scoreText.setText(`SCORE: ${this.score}`);
    }
  }

  private gameOver() {
    this.isGameOver = true;

    // Drop current block
    if (this.currentBlock) {
      this.tweens.add({
        targets: this.currentBlock,
        y: this.scale.height + 100,
        alpha: 0,
        duration: 500,
      });
    }

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

    // Blinking effect
    this.tweens.add({
      targets: restartText,
      alpha: 0.3,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    this.gameOverContainer.add([bg, gameOverText, finalScoreText, restartText]);

    // Scale in animation
    this.gameOverContainer.setScale(0);
    this.tweens.add({
      targets: this.gameOverContainer,
      scale: 1,
      duration: 300,
      ease: 'Back.out',
    });

    // Emit score to React
    this.emitScore();
  }

  private emitScore() {
    // Emit custom event for React to catch
    window.dispatchEvent(
      new CustomEvent('gameScore', {
        detail: { score: this.score, gameId: 'neon-tower' },
      })
    );
  }

  private restartGame() {
    // Clean up
    this.blocks.forEach((block) => block.destroy());
    this.blocks = [];

    if (this.gameOverContainer) {
      this.gameOverContainer.destroy();
      this.gameOverContainer = null;
    }

    // Reset state
    this.score = 0;
    this.isGameOver = false;
    this.currentBlock = null;
    this.baseY = this.scale.height - 100;

    // Reset score text
    if (this.scoreText) {
      this.scoreText.setText('SCORE: 0');
    }

    // Show instruction
    if (this.instructionText) {
      this.instructionText.setVisible(true);
    }

    // Create base block
    this.createBaseBlock();
  }

  update() {
    if (this.currentBlock && !this.isGameOver) {
      // Move the block horizontally
      this.currentBlock.x += BLOCK_SPEED * this.currentBlock.direction * (1 / 60);

      // Bounce off walls
      const halfWidth = this.currentBlock.width / 2;
      if (this.currentBlock.x + halfWidth >= this.scale.width) {
        this.currentBlock.direction = -1;
      } else if (this.currentBlock.x - halfWidth <= 0) {
        this.currentBlock.direction = 1;
      }
    }
  }
}
