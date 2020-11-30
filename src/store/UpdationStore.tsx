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
    shouldShowInstruction: boolean,
    progressState: ProgressState;
    score: string
    isActionDeleted: boolean;
    page: GameView;
    continuationToken: string;
};

const store: IGameUpdateStore = {
    context: null,
    shouldValidate: false,
    actionInstance: null,
    actionInstanceRows: null,
    progressState: ProgressState.NotStarted,
    isActionDeleted: false,
    score: null,
    page: GameView.InstructionView,
    shouldShowInstruction: true,
    continuationToken: null
}

export default createStore<IGameUpdateStore>("updationStore", store);