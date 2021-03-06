import { IDiskFile } from './IDiskFile.model';
import { join } from 'path';
import { SysWrapper } from '../utils/sysWrapper';
import { Utils } from '../utils';
import { SmartModel } from './smartModel';

/** Controller compiler object. */
export class ControllerModel extends SmartModel {
    constructor(
        public name: string,
        public projectName?: string,
        public ignoreConvention?: boolean) {
        super(name, projectName);
    }

    recompile() {
        throw new Error('Method not implemented.');
    }

    /** Save to disk. */
    async save() {
        await SysWrapper.createFileFromTemplate(
            this.filePath,
            {
                name: this.name,
                className: this.className,
                varName: this.varName
            }, this.templateFile);
    }

    /** TypeScript classs. */
    get className() {
        return this.name.match(/[a-z]+/gi)
            .map(function (word) {
                return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
            })
            .join('');
    }

    /** Set var name */
    get varName() {
        return Utils.toCamelCase(this.name);
    }

    /**
     * Static template file to be used.
     */
    get templateFile() {
        return join(__dirname, '../../templates/_controller.ts.ejs');
    }

    /** Actual file Path for the object. */
    get filePath() {
        if (!this.ignoreConvention) {
            return `${this.projectRoot}/packages/${this.name}-cc/src/${this.name}.controller.ts`;
        } else {
            return join(process.cwd(), `${this.name}.controller.ts`);
        }
    }
}
