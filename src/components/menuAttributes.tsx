import React from "react";
import { Link2Icon } from "@radix-ui/react-icons";

import { InputWithLabel } from "./ui/inputWithLabel";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import {
  controlnetTypeIds,
  models,
  schedulers,
} from "@/types/StableDiffusionApi";
import { Separator } from "./ui/separator";
import { NUMBER_OF_GENERATED_QR, SDAVariableParameters } from "@/hooks/useSDA";
import { ScrollArea } from "./ui/scroll-area";

export type InitialVariablesMenu = Omit<
  SDAVariableParameters,
  "prompt" | "initImage" | "controlImage"
>;

export const initialVariables: InitialVariablesMenu = {
  modelID: "ghostmix",
  controlModel: "qrcode",
  controlType: "qrcode",
  width: 512,
  height: 512,
  strength: 0.75,
  numInferenceSteps: 30,
  samples: NUMBER_OF_GENERATED_QR,
  guidanceScale: 7.5,
  scheduler: null,
};

interface MenuAttributesProps {
  label?: React.ReactElement | string;
  className?: string;
  onChange?: (variables: InitialVariablesMenu) => void;
}

type PayloadTypes = {
  [K in keyof InitialVariablesMenu]: InitialVariablesMenu[K];
};

interface ActionVariables<K extends keyof InitialVariablesMenu> {
  key: K;
  payload: PayloadTypes[K];
}

const reducerVariables = <K extends keyof InitialVariablesMenu>(
  state: InitialVariablesMenu,
  action: ActionVariables<K>
) => {
  state[action.key] = action.payload;
  return { ...state };
};

export const MenuAttributes = (props: MenuAttributesProps) => {
  const { label, className, onChange } = props;

  const [state, dispatch] = React.useReducer(
    reducerVariables,
    initialVariables
  );

  const onHandleChange = <
    K extends keyof InitialVariablesMenu,
    P extends InitialVariablesMenu[K]
  >(
    key: K,
    payload: P
  ) => dispatch({ key, payload });

  React.useEffect(() => {
    if (onChange) {
      onChange(state);
    }
  }, [state, onChange]);

  return (
    <div className={className}>
      <Label>{label}</Label>
      <Separator orientation="horizontal" className="bg-slate-300 mt-1 mb-2" />
      <div className="flex flex-col w-full gap-y-4">
        <div className="flex w-full gap-x-3 mt-2">
          <div className="flex flex-col w-1/2">
            <Label className="mb-2 text-slate-400">Image model</Label>
            <Select
              defaultValue={state.modelID}
              onValueChange={(value: InitialVariablesMenu["modelID"]) =>
                onHandleChange("modelID", value)
              }
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Model ID" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {models.map((modelId) => (
                    <SelectItem key={modelId} value={modelId}>
                      {modelId}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col w-1/2">
            <Label className="mb-2 text-slate-400">Controlnet model</Label>
            <Select
              defaultValue={state.controlModel}
              onValueChange={(value: InitialVariablesMenu["controlModel"]) => (
                onHandleChange("controlModel", value),
                onHandleChange("controlType", value)
              )}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Controlnet ID" />
              </SelectTrigger>
              <ScrollArea className="h-[200]">
                <SelectContent>
                  <SelectGroup>
                    {controlnetTypeIds.map((controlnetTypeId) => (
                      <SelectItem
                        key={controlnetTypeId}
                        value={controlnetTypeId}
                      >
                        {controlnetTypeId}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </ScrollArea>
            </Select>
          </div>
        </div>
        <div className="flex w-full gap-x-3 mt-1">
          <div className="flex w-1/2 gap-2 items-end">
            <InputWithLabel
              id="width"
              label={<span className="text-slate-400">Width</span>}
              type="number"
              placeholder="512"
              value={state.width}
              onChange={(value: string) => (
                onHandleChange("height", Number(value)),
                onHandleChange("width", Number(value))
              )}
            />
            <Link2Icon className="w-9 h-9" />
            <InputWithLabel
              id="height"
              label={<span className="text-slate-400">Height</span>}
              type="number"
              placeholder="512"
              value={state.height}
              onChange={(value: string) => (
                onHandleChange("height", Number(value)),
                onHandleChange("width", Number(value))
              )}
            />
          </div>
          <div className="flex w-1/2 gap-2 items-end">
            <InputWithLabel
              id="strength"
              label={<span className="text-slate-400">Strength</span>}
              type="text"
              placeholder="0.75"
              value={state.strength}
              onChange={(value: any) => onHandleChange("strength", value)}
            />
            <InputWithLabel
              id="steps"
              label={<span className="text-slate-400">Steps</span>}
              type="number"
              placeholder="30"
              value={state.numInferenceSteps}
              onChange={(value) =>
                onHandleChange("numInferenceSteps", Number(value))
              }
            />
          </div>
        </div>
        <div className="flex w-full gap-x-3 mt-1">
          <div className="flex flex-col w-2/3" style={{ maxWidth: "235px" }}>
            <Label className="mb-2 text-slate-400">Scheduler</Label>
            <Select
              defaultValue={state.scheduler ? state.scheduler : undefined}
              onValueChange={(value: string) =>
                onHandleChange(
                  "scheduler",
                  value as InitialVariablesMenu["scheduler"]
                )
              }
            >
              <SelectTrigger className="w-full bg-white overflow-ellipsis">
                <SelectValue placeholder="Scheduler ID" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {schedulers.map((schedulerId) => (
                    <SelectItem key={schedulerId} value={schedulerId}>
                      {schedulerId}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="w-1/3">
            <InputWithLabel
              id="GScale"
              label={<span className="text-slate-400">Guidance scale</span>}
              type="text"
              placeholder="7.5"
              value={state.guidanceScale}
              onChange={(value: any) => onHandleChange("guidanceScale", value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
