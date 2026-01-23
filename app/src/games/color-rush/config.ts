import Phaser from 'phaser';

// Game constants
const COLORS = [
  { name: 'CYAN', hex: 0x00ffff },
  { name: 'MAGENTA', hex: 0xff00ff },
  { name: 'YELLOW', hex: 0xfbbf24 },
  { name: 'GREEN', hex: 0x22c55e },
];
const GAME_DURATION = 30; // seconds
const BUTTON_SIZE = 80;
const INITIAL_TIME_PER_MATCH = 3000; // ms
const MIN_TIME_PER_MATCH = 800; // ms
const TIME_DECREASE_RATE = 100; // ms per correct match

interface ColorButton extends Phaser.GameObjects.Container {
  colorIndex: number;
}

class ColorRushScene extends Phaser.Scene {
  private score = 0;
  private combo = 0;
  private maxCombo = 0;
  private isGameOver = false;
  private isPlaying = false;
  private targetColor = 0;
  private timeRemaining = GAME_DURATION;
  private matchTimeRemaining = INITIAL_TIME_PER_MATCH;
  private currentMatchTime = INITIAL_TIME_PER_MATCH;

  private scoreText: Phaser.GameObjects.Text | null = null;
  private timerText: Phaser.GameObjects.Text | null = null;
  private comboText: Phaser.GameObjects.Text | null = null;
  private targetDisplay: Phaser.GameObjects.Container | null = null;
  private targetRect: Phaser.GameObjects.Rectangle | null = null;
  private targetLabel: Phaser.GameObjects.Text | null = null;
  private instructionText: Phaser.GameObjects.Text | null = null;
  private gameOverContainer: Phaser.GameObjects.Container | null = null;
  private colorButtons: ColorButton[] = [];
  private matchTimerBar: Phaser.GameObjects.Rectangle | null = null;
  private matchTimerBg: Phaser.GameObjects.Rectangle | null = null;
  private gameTimer: Phaser.Time.TimerEvent | null = null;

  constructor() {
    super({ key: 'ColorRushScene' });
  }

  create() {
    const { width, height } = this.scale;

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a0f);

    // Create grid lines
    this.createGridLines();

    // Create UI elements
    this.createUI();

    // Create color buttons
    this.createColorButtons();

    // Instruction text
    this.instructionText = this.add
      .text(width / 2, height / 2, 'TAP TO START', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '16px',
        color: '#00ffff',
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: this.instructionText,
      alpha: 0.5,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    // Input handler for starting
    this.input.on('pointerdown', () => {
      if (!this.isPlaying && !this.isGameOver) {
        this.startGame();
      } else if (this.isGameOver) {
        this.restartGame();
      }
    });
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

  private createUI() {
    const { width } = this.scale;

    // Score
    this.scoreText = this.add
      .text(width / 2, 30, 'SCORE: 0', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '14px',
        color: '#00ffff',
      })
      .setOrigin(0.5);

    // Timer
    this.timerText = this.add
      .text(width / 2, 55, `TIME: ${GAME_DURATION}`, {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '12px',
        color: '#fbbf24',
      })
      .setOrigin(0.5);

    // Combo
    this.comboText = this.add
      .text(width / 2, 80, '', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '10px',
        color: '#ff00ff',
      })
      .setOrigin(0.5);

    // Target display
    this.targetDisplay = this.add.container(width / 2, 160);

    const targetBg = this.add.rectangle(0, 0, 180, 80, 0x1a1a2e);
    targetBg.setStrokeStyle(2, 0xffffff, 0.3);

    this.targetLabel = this.add
      .text(0, -20, 'MATCH:', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '10px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.targetRect = this.add.rectangle(0, 15, 60, 30, 0x00ffff);
    this.targetRect.setStrokeStyle(2, 0xffffff, 0.8);

    this.targetDisplay.add([targetBg, this.targetLabel, this.targetRect]);
    this.targetDisplay.setVisible(false);

    // Match timer bar
    this.matchTimerBg = this.add.rectangle(width / 2, 220, 200, 8, 0x1a1a2e);
    this.matchTimerBg.setStrokeStyle(1, 0xffffff, 0.3);
    this.matchTimerBg.setVisible(false);

    this.matchTimerBar = this.add.rectangle(width / 2, 220, 200, 8, 0x22c55e);
    this.matchTimerBar.setOrigin(0.5);
    this.matchTimerBar.setVisible(false);
  }

  private createColorButtons() {
    const { width, height } = this.scale;
    const startY = height - 150;
    const spacing = 10;
    const totalWidth = COLORS.length * BUTTON_SIZE + (COLORS.length - 1) * spacing;
    const startX = (width - totalWidth) / 2 + BUTTON_SIZE / 2;

    COLORS.forEach((color, index) => {
      const x = startX + index * (BUTTON_SIZE + spacing);
      const button = this.createColorButton(x, startY, color.hex, index);
      this.colorButtons.push(button);
    });
  }

  private createColorButton(x: number, y: number, color: number, index: number): ColorButton {
    const container = this.add.container(x, y) as ColorButton;
    container.colorIndex = index;

    const rect = this.add.rectangle(0, 0, BUTTON_SIZE, BUTTON_SIZE, color);
    rect.setStrokeStyle(3, 0xffffff, 0.5);

    // Add glow effect
    this.tweens.add({
      targets: rect,
      alpha: 0.8,
      duration: 500 + index * 100,
      yoyo: true,
      repeat: -1,
    });

    container.add(rect);
    container.setSize(BUTTON_SIZE, BUTTON_SIZE);
    container.setInteractive();

    container.on('pointerdown', () => this.handleColorTap(index));

    // Hover effect
    container.on('pointerover', () => {
      this.tweens.add({
        targets: container,
        scale: 1.1,
        duration: 100,
      });
    });

    container.on('pointerout', () => {
      this.tweens.add({
        targets: container,
        scale: 1,
        duration: 100,
      });
    });

    return container;
  }

  private handleColorTap(colorIndex: number) {
    if (!this.isPlaying || this.isGameOver) return;

    if (colorIndex === this.targetColor) {
      // Correct!
      this.correctMatch();
    } else {
      // Wrong!
      this.wrongMatch();
    }
  }

  private correctMatch() {
    this.score += 10 + this.combo * 5;
    this.combo++;
    this.maxCombo = Math.max(this.maxCombo, this.combo);

    // Update UI
    if (this.scoreText) {
      this.scoreText.setText(`SCORE: ${this.score}`);
      this.tweens.add({
        targets: this.scoreText,
        scale: 1.2,
        duration: 100,
        yoyo: true,
      });
    }

    if (this.comboText) {
      this.comboText.setText(`COMBO x${this.combo}`);
      this.comboText.setColor('#22c55e');
    }

    // Flash effect on target
    if (this.targetRect) {
      this.tweens.add({
        targets: this.targetRect,
        alpha: 0.3,
        duration: 50,
        yoyo: true,
        repeat: 2,
      });
    }

    // Decrease match time (make it harder)
    this.currentMatchTime = Math.max(
      MIN_TIME_PER_MATCH,
      this.currentMatchTime - TIME_DECREASE_RATE
    );

    // Next target
    this.setNextTarget();
  }

  private wrongMatch() {
    this.combo = 0;

    if (this.comboText) {
      this.comboText.setText('MISS!');
      this.comboText.setColor('#ef4444');

      this.time.delayedCall(500, () => {
        if (this.comboText) this.comboText.setText('');
      });
    }

    // Screen shake
    this.cameras.main.shake(100, 0.01);

    // Time penalty
    this.timeRemaining = Math.max(0, this.timeRemaining - 2);
  }

  private setNextTarget() {
    // Pick a different color
    let newColor = this.targetColor;
    while (newColor === this.targetColor) {
      newColor = Phaser.Math.Between(0, COLORS.length - 1);
    }
    this.targetColor = newColor;

    // Update target display
    const targetColorObj = COLORS[this.targetColor];
    if (this.targetRect && targetColorObj) {
      this.targetRect.setFillStyle(targetColorObj.hex);
    }

    // Reset match timer
    this.matchTimeRemaining = this.currentMatchTime;
  }

  private startGame() {
    this.isPlaying = true;

    if (this.instructionText) {
      this.instructionText.setVisible(false);
    }

    if (this.targetDisplay) {
      this.targetDisplay.setVisible(true);
    }

    if (this.matchTimerBg) {
      this.matchTimerBg.setVisible(true);
    }

    if (this.matchTimerBar) {
      this.matchTimerBar.setVisible(true);
    }

    // Set initial target
    this.targetColor = Phaser.Math.Between(0, COLORS.length - 1);
    const initialColorObj = COLORS[this.targetColor];
    if (this.targetRect && initialColorObj) {
      this.targetRect.setFillStyle(initialColorObj.hex);
    }

    // Start game timer
    this.gameTimer = this.time.addEvent({
      delay: 1000,
      callback: this.tickTimer,
      callbackScope: this,
      loop: true,
    });
  }

  private tickTimer() {
    this.timeRemaining--;

    if (this.timerText) {
      this.timerText.setText(`TIME: ${this.timeRemaining}`);

      if (this.timeRemaining <= 10) {
        this.timerText.setColor('#ef4444');
      }
    }

    if (this.timeRemaining <= 0) {
      this.gameOver();
    }
  }

  private gameOver() {
    this.isGameOver = true;
    this.isPlaying = false;

    if (this.gameTimer) {
      this.gameTimer.destroy();
    }

    // Hide game elements
    if (this.targetDisplay) {
      this.targetDisplay.setVisible(false);
    }

    if (this.matchTimerBg) {
      this.matchTimerBg.setVisible(false);
    }

    if (this.matchTimerBar) {
      this.matchTimerBar.setVisible(false);
    }

    // Show game over UI
    const { width, height } = this.scale;

    this.gameOverContainer = this.add.container(width / 2, height / 2);

    const bg = this.add.rectangle(0, 0, 280, 220, 0x0a0a0f, 0.95);
    bg.setStrokeStyle(2, 0xff00ff);

    const gameOverText = this.add
      .text(0, -70, 'TIME UP!', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '20px',
        color: '#fbbf24',
      })
      .setOrigin(0.5);

    const finalScoreText = this.add
      .text(0, -20, `SCORE: ${this.score}`, {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '14px',
        color: '#00ffff',
      })
      .setOrigin(0.5);

    const comboText = this.add
      .text(0, 20, `MAX COMBO: ${this.maxCombo}`, {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '10px',
        color: '#ff00ff',
      })
      .setOrigin(0.5);

    const restartText = this.add
      .text(0, 70, 'TAP TO RETRY', {
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

    this.gameOverContainer.add([bg, gameOverText, finalScoreText, comboText, restartText]);

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
        detail: { score: this.score, gameId: 'color-rush' },
      })
    );
  }

  private restartGame() {
    if (this.gameOverContainer) {
      this.gameOverContainer.destroy();
      this.gameOverContainer = null;
    }

    // Reset state
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.isGameOver = false;
    this.isPlaying = false;
    this.timeRemaining = GAME_DURATION;
    this.currentMatchTime = INITIAL_TIME_PER_MATCH;
    this.matchTimeRemaining = INITIAL_TIME_PER_MATCH;

    // Reset UI
    if (this.scoreText) {
      this.scoreText.setText('SCORE: 0');
    }

    if (this.timerText) {
      this.timerText.setText(`TIME: ${GAME_DURATION}`);
      this.timerText.setColor('#fbbf24');
    }

    if (this.comboText) {
      this.comboText.setText('');
    }

    // Show instruction
    if (this.instructionText) {
      this.instructionText.setVisible(true);
    }
  }

  update(_time: number, delta: number) {
    if (!this.isPlaying || this.isGameOver) return;

    // Update match timer
    this.matchTimeRemaining -= delta;

    if (this.matchTimerBar) {
      const progress = Math.max(0, this.matchTimeRemaining / this.currentMatchTime);
      this.matchTimerBar.scaleX = progress;

      // Change color based on remaining time
      if (progress < 0.3) {
        this.matchTimerBar.setFillStyle(0xef4444);
      } else if (progress < 0.6) {
        this.matchTimerBar.setFillStyle(0xfbbf24);
      } else {
        this.matchTimerBar.setFillStyle(0x22c55e);
      }
    }

    // Time out for this match
    if (this.matchTimeRemaining <= 0) {
      this.wrongMatch();
      this.setNextTarget();
    }
  }
}

const config: Partial<Phaser.Types.Core.GameConfig> = {
  scene: [ColorRushScene],
};

export default config;
