import { Injectable } from '@nestjs/common';
import { promises as fsPromises, existsSync } from 'fs';
import * as path from 'path';

@Injectable()
export class LogsService {
  async logToFile(entry: string, ip?: string) {
    const formattedEntry = `
 ${Intl.DateTimeFormat('en-US', {
   dateStyle: 'short',
   timeStyle: 'short',
   timeZone: 'Africa/Nairobi',
 }).format(new Date())} - IP: ${ip || 'unknown'} - ${entry}\n`;

    try {
      const logsPath = path.join(__dirname, '..', '..', 'applogs');
      if (!existsSync(logsPath)) {
        await fsPromises.mkdir(logsPath);
      }
      await fsPromises.appendFile(
        path.join(logsPath, 'myLogFile.log'),
        formattedEntry,
      );
    } catch (e) {
      if (e instanceof Error) console.error(e.message);
    }
  }
}
