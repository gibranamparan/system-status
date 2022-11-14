export default class HardwareInfo {
  public deviceType: string | null = null
  public hwVersion: number | null = null
  public fwVersionMajor: number | null = null
  public fwVersionMinor: number | null = null
  public button1Presses: number | null = null
  public button2Presses: number | null = null
  public button3Presses: number | null = null
  public lifetimeTxCount: number | null = null
  public lastConnector: string | null = null

  constructor(obj?: HardwareInfo) {
    if (!obj) return
    Object.assign(this, obj)
  }

  public get fwVersion(): string {
    return `${this.fwVersionMajor}.${this.fwVersionMinor}`
  }

  public get buttonPresses(): string {
    return `${this.button1Presses}, ${this.button2Presses}, ${this.button3Presses}`
  }

  public get lifeTimeTxStr(): string {
    // transform lifetimeTxCount which is in ms to HH:MM:SS
    const ms = this.lifetimeTxCount ?? 0
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const years = Math.floor(days / 365)
    const s = seconds % 60
    const m = minutes % 60
    const h = hours % 24
    const d = days % 365
    const y = years

    let res = `${s}s`
    res = (m ? `${m}m ` : '') + res
    res = (h ? `${h}h ` : '') + res
    res = (d ? `${d}d ` : '') + res
    res = (y ? `${y}y ` : '') + res

    return res
  }
}
