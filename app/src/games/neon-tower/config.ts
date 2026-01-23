import type Phaser from 'phaser';
import { NeonTowerScene } from './NeonTowerScene';

const config: Partial<Phaser.Types.Core.GameConfig> = {
  scene: [NeonTowerScene],
};

export default config;
