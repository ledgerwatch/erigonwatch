import { Version } from "../entities"

export const versionFromJson = (json: any): Version => {
    return {
        nodeVersion: json.nodeVersion,
        supportVersion: json.supportVersion,
        codeVersion: json.codeVersion,
        gitCommit: json.gitCommit,
    }
}