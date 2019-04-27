import { IRaptorCommand, RaptorRemoteCommandResponse } from './protobufs/rcast-protobufs'
import { Utility } from './utility'
import { TransferdataService } from './services/transferdata.service'
import { Injectable } from '@angular/core';


export class Command {
  constructor(public name: string, public raptorCmd: IRaptorCommand, public dependencies: string[],
    public specialResponseProcessFn?: (resp: RaptorRemoteCommandResponse) => any,
    public specialCommandAssembleFn?: (cmd: Command, collectedValues: object) => Command,
  ) { }
}

export abstract class CommandFactory {
  constructor() { }
  
  protected cmdsPool: Map<string, Command> = new Map<string, Command>();
  getNewCmd(name: string): Command | null {
    let cmd: Command
    const staticCmd: Command = this.cmdsPool.get(name)
    if (staticCmd) {
      cmd = Utility.cloneObj(staticCmd)
      cmd.raptorCmd = Utility.cloneObj(staticCmd.raptorCmd)
    }
    return cmd
  }

}
