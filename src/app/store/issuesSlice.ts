import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { selectActiveNodeId } from "./appSlice";

export enum IssueType {
	SnapshotSegmentMissingPeers = "SnapshotSegmentMissingPeers",
	NetworkSpeedIssue = "NetworkSpeedIssue",
}
export interface NodeIssue {
	nodeId: string;
	issues: Issue[];
}

export interface Issue {
	type: IssueType;
	message: string;
	id: string;
	timestamp: number;
}

export interface IssueState {
	issues: NodeIssue[];
}

const initialState: IssueState = {
	issues: []
};

export const issuesSlice = createSlice({
	name: "issue",
	initialState,
	reducers: {
		addOrUpdateIssue: (state, action: PayloadAction<{ issue: Issue; nodeId: string }>) => {
			let nodeIdx = state.issues.findIndex((issue) => issue.nodeId === action.payload.nodeId);
			if (nodeIdx !== -1) {
				let issueIdx = state.issues[nodeIdx].issues.findIndex((issue) => issue.id === action.payload.issue.id);
				if (issueIdx !== -1) {
					state.issues[nodeIdx].issues[issueIdx] = action.payload.issue;
				} else {
					state.issues[nodeIdx].issues.push(action.payload.issue);
				}
			} else {
				state.issues.push({ nodeId: action.payload.nodeId, issues: [action.payload.issue] });
			}
		},
		removeIssueWithId: (state, action: PayloadAction<{ nodeId: string; issueId: string }>) => {
			let nodeIdx = state.issues.findIndex((issue) => issue.nodeId === action.payload.nodeId);
			if (nodeIdx !== -1) {
				let issueIdx = state.issues[nodeIdx].issues.findIndex((issue) => issue.id === action.payload.issueId);
				if (issueIdx !== -1) {
					state.issues[nodeIdx].issues.splice(issueIdx, 1);
				}
			}
		},
		resetIssueState: () => initialState
	}
});

export const { addOrUpdateIssue, resetIssueState, removeIssueWithId } = issuesSlice.actions;

export const selectIssues = (state: RootState): NodeIssue[] => state.issues.issues;
export const selectIssuesForActiveNode = createSelector([selectIssues, selectActiveNodeId], (nodeIssues, activeNodeId): Issue[] => {
	let result: Issue[] = [];
	nodeIssues.forEach((nodeIssue) => {
		if (nodeIssue.nodeId === activeNodeId) {
			result = nodeIssue.issues;
		}
	});
	return result;
});

export const selectIssuesCountForBadge = createSelector([selectIssuesForActiveNode], (issues): string => {
	if (issues.length > 10) {
		return "9+";
	} else {
		return issues.length.toString();
	}
});

export const selectNetworkSpeedIssues = createSelector([selectIssuesForActiveNode], (issues): Issue[] => {
	let result: Issue[] = [];
	issues.forEach((issue) => {
		if (issue.type === IssueType.NetworkSpeedIssue) {
			result.push(issue);
		}
	});
	return result;
});

export default issuesSlice.reducer;
