import ScreenInput from '~/components/UI/ScreenInput'

//@flow
export type User = {
  uid: string,
  displayName: string,
  email: string,
  photoURL?: string,
}

export type Project = {
  projectId: string,
  name: string,
  author: string,
  templateId: string,
  primaryColor: string,
  secundaryColor: string,
  accentColor: string,
  lastPublished: string,
}

export type Screen = {
  id: string,
  name: string,
  isFinal: boolean,
  submitText: string,
  size: number,
  maxWeight: number,
}

type InputMetadata = {
  icon: string,
  type: string,
  weight: number,
}

export type TextInput = {
  varName: string,
  isRequired: boolean,
  placeholder: string,
  weight: number,
  metadata: InputMetadata,
}

type RadioButtonOption = {
  label: string,
  value: string,
}

export type RadioButton = {
  title: string,
  isRequired: boolean,
  varName: string,
  defaultOption: string,
  metadata: InputMetadata,
  options: Array<RadioButtonOption>,
}

export type Build = {
  id: string,
  modifiedAt: string,
  templateId: string,
  screenBuilds: Array<ScreenBuild>,
}

type ScreenBuild = {
  name: string,
  size: string,
  targetURL: string,
  generatedURL: string,
  submitText: string,
  screenInputs: Array<ScreenInput>,
}
