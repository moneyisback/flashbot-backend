import { BigNumber, ethers } from 'ethers'

interface GasOptions {
  gasLimit?: number
  maxPriorityMin?: number // en gwei
  maxPriorityMax?: number // en gwei
  maxFeeCap?: number      // en gwei
}

export function getPaddedGasOptions(options: GasOptions = {}) {
  const gasLimit = BigNumber.from(options.gasLimit || 800_000)

  const priorityMin = options.maxPriorityMin || 2
  const priorityMax = options.maxPriorityMax || 6
  const maxFeeCap = options.maxFeeCap || 130

  const priorityFeeGwei = getRandomInt(priorityMin, priorityMax)
  const maxFeePerGasGwei = priorityFeeGwei + getRandomInt(10, maxFeeCap - priorityFeeGwei)

  return {
    gasLimit,
    maxPriorityFeePerGas: ethers.utils.parseUnits(priorityFeeGwei.toString(), 'gwei'),
    maxFeePerGas: ethers.utils.parseUnits(maxFeePerGasGwei.toString(), 'gwei')
  }
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
