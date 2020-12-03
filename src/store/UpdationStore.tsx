import { ProgressState } from "./../utils/SharedEnum";
import { createStore } from "satcheljs";
export enum GameView {
    InstructionView,
    Game,
    CongratuationView
}

interface IGameUpdateStore {
    context: actionSDK.ActionSdkContext;
    actionInstance: actionSDK.Action;
    actionInstanceRows: actionSDK.ActionDataRow[];
    shouldValidate: boolean;
    shouldShowInstruction: boolean;
    progressState: ProgressState;
    score: actionSDK.ActionDataRow;
    isActionDeleted: boolean;
    page: GameView;
    continuationToken: string;
    shouldUserPlay: boolean;
    playerPrevScore: string;
};

const store: IGameUpdateStore = {
    context: null,
    shouldValidate: false,
    actionInstance: null,
    actionInstanceRows: null,
    progressState: ProgressState.Completed,
    isActionDeleted: false,
    score: null,
    page: GameView.InstructionView,
    shouldUserPlay: true,
    playerPrevScore: null,
    shouldShowInstruction: true,
    continuationToken: null
}

export default createStore<IGameUpdateStore>("updationStore", store);