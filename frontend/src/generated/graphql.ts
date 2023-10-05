export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type CardAssignee = Node & {
  __typename?: 'CardAssignee';
  /** card_id */
  cardId?: Maybe<Scalars['ID']['output']>;
  /** id */
  id: Scalars['ID']['output'];
  /** user_id */
  userId?: Maybe<Scalars['ID']['output']>;
};

export type CardAttachments = Node & {
  __typename?: 'CardAttachments';
  /** attachment */
  attachment?: Maybe<Scalars['String']['output']>;
  /** card_id */
  cardId?: Maybe<Scalars['ID']['output']>;
  /** id */
  id: Scalars['ID']['output'];
  /** user_id */
  userId?: Maybe<Scalars['ID']['output']>;
};

export type CardComments = Node & {
  __typename?: 'CardComments';
  /** card_id */
  cardId?: Maybe<Scalars['ID']['output']>;
  /** comment */
  comment?: Maybe<Scalars['String']['output']>;
  /** created_at */
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** id */
  id: Scalars['ID']['output'];
  /** updated_at */
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  /** user_id */
  userId?: Maybe<Scalars['ID']['output']>;
};

export type Cards = Node & {
  __typename?: 'Cards';
  /** column_id */
  columnId?: Maybe<Scalars['ID']['output']>;
  /** description */
  description?: Maybe<Scalars['String']['output']>;
  /** id */
  id: Scalars['ID']['output'];
  /** order */
  order?: Maybe<Scalars['Int']['output']>;
  /** priority */
  priority?: Maybe<Scalars['String']['output']>;
  /** status */
  status?: Maybe<Scalars['String']['output']>;
  /** title */
  title?: Maybe<Scalars['String']['output']>;
};

export type Columns = Node & {
  __typename?: 'Columns';
  cards?: Maybe<Array<Maybe<Cards>>>;
  /** dashboard_id */
  dashboardId?: Maybe<Scalars['ID']['output']>;
  /** description */
  description?: Maybe<Scalars['String']['output']>;
  /** id */
  id: Scalars['ID']['output'];
  /** order */
  order?: Maybe<Scalars['Int']['output']>;
  /** title */
  title?: Maybe<Scalars['String']['output']>;
};

export type CreateCard = {
  __typename?: 'CreateCard';
  card?: Maybe<Cards>;
};

export type CreateColumn = {
  __typename?: 'CreateColumn';
  column?: Maybe<Columns>;
};

export type CreateDashboard = {
  __typename?: 'CreateDashboard';
  dashboard?: Maybe<Dashboard>;
};

export type CreateUser = {
  __typename?: 'CreateUser';
  user?: Maybe<Users>;
};

export type Dashboard = Node & {
  __typename?: 'Dashboard';
  assignees?: Maybe<Array<Maybe<Users>>>;
  columns?: Maybe<Array<Maybe<Columns>>>;
  /** description */
  description?: Maybe<Scalars['String']['output']>;
  /** id */
  id: Scalars['ID']['output'];
  /** title */
  title?: Maybe<Scalars['String']['output']>;
};

export type DeleteAllUsers = {
  __typename?: 'DeleteAllUsers';
  deletedCount?: Maybe<Scalars['Int']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteColumn = {
  __typename?: 'DeleteColumn';
  column?: Maybe<Columns>;
};

export type DeleteDashboard = {
  __typename?: 'DeleteDashboard';
  dashboard?: Maybe<Dashboard>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createCard?: Maybe<CreateCard>;
  createColumn?: Maybe<CreateColumn>;
  createDashboard?: Maybe<CreateDashboard>;
  createUser?: Maybe<CreateUser>;
  deleteColumn?: Maybe<DeleteColumn>;
  deleteDashboard?: Maybe<DeleteDashboard>;
  deleteUser?: Maybe<DeleteAllUsers>;
  updateColumn?: Maybe<UpdateColumn>;
  updateDashboard?: Maybe<UpdateDashboard>;
  updateUser?: Maybe<UpdateUser>;
};


export type MutationCreateCardArgs = {
  columnId: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};


export type MutationCreateColumnArgs = {
  dashboardId: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};


export type MutationCreateDashboardArgs = {
  assignees?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  description?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};


export type MutationCreateUserArgs = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  role: RoleEnum;
};


export type MutationDeleteColumnArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteDashboardArgs = {
  id: Scalars['String']['input'];
};


export type MutationUpdateColumnArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  order?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateDashboardArgs = {
  assignees?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateUserArgs = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  id: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  role: RoleEnum;
};

/** An object with an ID */
export type Node = {
  /** The ID of the object. */
  id: Scalars['ID']['output'];
};

export type Query = {
  __typename?: 'Query';
  cardAssignee?: Maybe<Array<Maybe<CardAssignee>>>;
  cardAttachments?: Maybe<Array<Maybe<CardAttachments>>>;
  cardComments?: Maybe<Array<Maybe<CardComments>>>;
  cards?: Maybe<Array<Maybe<Cards>>>;
  columns?: Maybe<Array<Maybe<Columns>>>;
  dashboard?: Maybe<Array<Maybe<Dashboard>>>;
  node?: Maybe<Node>;
  users?: Maybe<Array<Maybe<Users>>>;
};


export type QueryCardsArgs = {
  columnId: Scalars['String']['input'];
};


export type QueryColumnsArgs = {
  dashboardId: Scalars['String']['input'];
};


export type QueryNodeArgs = {
  id: Scalars['ID']['input'];
};

export enum RoleEnum {
  Admin = 'ADMIN',
  Guest = 'GUEST',
  User = 'USER'
}

export type UpdateColumn = {
  __typename?: 'UpdateColumn';
  column?: Maybe<Columns>;
};

export type UpdateDashboard = {
  __typename?: 'UpdateDashboard';
  dashboard?: Maybe<Dashboard>;
};

export type UpdateUser = {
  __typename?: 'UpdateUser';
  user?: Maybe<Users>;
};

export type Users = Node & {
  __typename?: 'Users';
  /** email */
  email?: Maybe<Scalars['String']['output']>;
  /** first_name */
  firstName?: Maybe<Scalars['String']['output']>;
  /** id */
  id: Scalars['ID']['output'];
  /** last_name */
  lastName?: Maybe<Scalars['String']['output']>;
  /** role */
  role?: Maybe<Scalars['String']['output']>;
};

export type DashboardQueryVariables = Exact<{ [key: string]: never; }>;


export type DashboardQuery = { __typename?: 'Query', dashboard?: Array<{ __typename?: 'Dashboard', id: string, description?: string | null, title?: string | null, assignees?: Array<{ __typename?: 'Users', id: string } | null> | null, columns?: Array<{ __typename?: 'Columns', id: string, cards?: Array<{ __typename?: 'Cards', title?: string | null, order?: number | null } | null> | null } | null> | null } | null> | null };
