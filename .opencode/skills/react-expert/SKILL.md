---
name: react-expert
description: frontend coding guidelines when implementing react code with typescript
---

# React (TypeScript) Coding Guidelines

This guide will go provide insight into what should be considered when writing their React code in order to develop code that is robust, understandable, maintainable and scalable.

## extensions

### ESLint

ESLint is used to prevent commonly made mistakes when developing with JavaScript / TypeScript. The recommended rules that are being used are:

- Recommended ESLint
- Recommended Typescript-ESLint
- Recommended react, JSX and react-hooks
- Recommended SonarJS rules
- Prettier to mitigate conflicts with formatting

## React guidelines

This section will cover important conventions that should be followed when writing React component and hooks. The [official React documentation](https://react.dev/reference/rules) contains a brief section covering rules when writing idiomatic React code. However, it only covers the very basic principles which is why this guide will extend upon these principles to help developers improve their code quality

### Defining React components

Use regular function definition syntax for React components

```js
export function Component() {
    return ...
}
```

### Naming Convention for hooks and components

In React, it is common to use PascalCase for component names. Hooks should always begin with `use` as prefix. For example:

```js
function useCustomHook() {
    return ...
}

// For components, use PascalCase naming convention
export function CustomComponent() {
    return ...
}
```

### conditional rendering

Prefer to use `if`-statements with early returns for different variants of a rendered component. If a check is nested inside the DOM tree, use `&&` if you only toggle a component and ternaries for switching between components

```js
// here, the full component differs on specific conditions
if (specialState) {
  return <SpecialComponentState />;
}

return <NormalComponentState />;

// enable a component only if needed, left side should always be a boolean operation
showComponent && <Component />;

// render different components depending on the condition
isRendered ? <ComponentA /> : <ComponentB />;
```

### Create and use React Context

Always make sure to create the context with a null value and create a custom hook which throws an exception if the context is still null

```js
const C = createContext(null);

function useCustomContext() {
  const ctx = useContext(C);

  if (ctx == null)
    throw new Error("The context C is not used insode a provider");

  return ctx;
}
```

## React SOLID principles

Good code is characterized by being functional, maintainable, and robust. It should be easy to make changes and to add new features to improve readability. Many "rules of thumb" have been developed to help developers achieve these characteristics. These rules or philosophies are intended to allow writing code in any language or paradigm. One of those are the SOLID design principles which consist of five separate design principles which we will explain further below. Initially, SOLID design principles were designed towards object-oriented languages which contain features such as proper classes and interfaces. Frontends that use the React library differ due to the nature of React since the introduction of functional components. Hooks also pushed the shift in React 16. That means that we cannot directly translate principles that are supposed to be applied in object-oriented languages to our React code. However, we can still translate the meaning of each principle to our React code with slight differences from a strict OOP-language, still resulting in more efficient Frontend code. With the addition of Typescript, which adds more static language features, these principles can be applied more efficiently, thus allowing us to map these ideas easier. In this article, we will go through each SOLID principle and how we can apply them in our frontends using React and Typescript. For a better understanding, we will go through each principle one by one with examples.

**SOLID is an acronym for five separate design principles, first introduced by Robert C. Martin in his 2000 book “Designing Object-Oriented C++ Applications Using the Booch Method”:**

- Single Responsibility Principle (SRP)
- Open / Closed Principle (OCP)
- Liskov Substitution Principle (LSP)
- Interface Segregation Principle (ISP)
- Dependency Inversion Principle (DIP)

### Single Responsibility Principle

The Single Responsibility Principle (SRP) is the first of the five principles on the list that will be explained as it probably is the most crucial principle to follow, especially if you write code in React. Fundamentally, SRP states that "A module should be responsible to one, and only one, actor", an actor referring to one or more stakeholders or users that require a change in the module. In other words, the code we write should only have one purpose. Since these principles are usually applied to object-oriented languages such as Java, it normally means that classes should be responsible only for one single functionality. However, the core principle remains the same, regardless of the language we are using: Extracting functionality from files into separate functions so that the code becomes more maintainable and robust. Fragmenting our code into smaller functions and files also makes testing easier. Even though we are not using classes in React, we can still map the core statement to our React code. Pretty much, each component should be responsible for only one single functionality. Whether it is displaying the UI, fetching data from an API, or other functionalities. In short, we separate displaying UI and logic associated to our UI. By doing so, we split our code into two different kinds of components. Presentational components, who are responsible purely for displaying the UI, and logical components, whose purpose is to deal with logic and external affairs.

Let’s take a look at an example to illustrate this principle:

```javascript
export function UserProfile() {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`https://exampleApi.com/users`);
      if (!response.ok) {
        throw new Error("Could not load user data");
      }
      const users = await response.json();
      setUsers(users);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <ul>
      {users.map((user) => (
        <li>
          <User name={user.name} email={user.email} key={user.id}/>
        </li>
      ))}
    </ul>
  );
}
```

We have our UserProfile component, in which we first fetch the users from our API and then iterate over the received users object to display each user in our UI. However, this component violates the SRP due to rendering the UI and handling the logic for fetching data. By rendering the UI and fetching the data, the component has too many responsibilities so let's try to separate the logic by extracting it into a separate function. We will extract the fetching logic into a custom hook called useUsers:

```javascript
const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`https://exampleApi.com/users`);
      if (!response.ok) {
        throw new Error("Could not load user data");
      }
      const users = await response.json();
      setUsers(users);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return { users };
};
```

Our refactored component would look like this:

```javascript
export function UserProfile() {
  const { users } = useUsers();

  return (
    <ul>
      {users.map((user) => (
        <li>
          <User name={user.name} email={user.email} key={user.id} />
        </li>
      ))}
    </ul>
  );
}
```

In our example, we extracted the data fetching from the API into a separate file which is only responsible for fetching from said API. Now, our component is short and clean, making it easier to read while reducing the risk of accidentally having duplicate code in our codebase due to large and complex files. Please keep in mind though, that extracting every small functionality, or in other terms over-fragmentating our code, can cause the opposite effect. Less lines of code don’t necessarily mean easier readable code. By extracting logic and separating it into multiple files, the code could potentially lead to a lesser understanding of our code as other developers or clients would have to browse through multiple files to get an understanding of what our code does. So always think twice about when to extract functionality from our codebase and how much to extract. As a rule of thumb, React hooks can typically be bundled and refactored into a custom hook. If you, for example, use a utility function within your component and you are sure that its purpose will only serve said component, there shouldn’t be a need to extract it into a new file, as long as it’s not too long. Let’s move on to the next principle.

### Open / Closed Principle

The Open Closed Principle (OCP) is one of the more important and strictly followed principles. It pretty much tells us to write our code open for extensions and closed for modifications, pretty much adding new features without having to change the existing code itself. Mapping this principle to React means that we should avoid using inheritance and use composition to build complex code when required. Instead of creating larger-scale components that require type checks or are vulnerable to code changes, we create smaller flexible, customizable components using props and children. Because Typescript has its strength in allowing us to define interfaces that guarantee type checks, we can include ReactNode in our interface as props to pass to our component, allowing us to customize our components as much as we want to. Surprisingly enough, you are already following this principle in your codebase without knowing it since React encourages OCP by using props, allowing you compose larger components from smaller ones using props to impart customizability. Even though this principle should be self-explanatory to React Developers by now, let’s look at an example nonetheless!

```javascript
type ButtonType = "primary" | "secondary";

interface ButtonProps {
  type: ButtonType;
  label: string;
}

export function Button({ type, label }: ButtonProps) {
  return (
    <div>
      {type === "primary" && (
        <span style={{ backgroundColor: "red" }}>Primary</span>
      )}
      {type === "secondary" && (
        <span style={{ border: "2px dotted" }}>Secondary</span>
      )}
      <button>{label}</button>
    </div>
  );
}
```

Our Button component violates the OCP because if we were to add a new button type, we would have to modify the Button component itself. So, let’s change our component to adhere to the principle:

```javascript
import { ReactNode } from "react";

interface ButtonProps {
  label: string;
  children?: ReactNode;
}

export function Button({ label, children }: ButtonProps) {
  return (
    <div>
      {children}
      <button>{label}</button>
    </div>
  );
}

export function PrimaryButton({ label }: ButtonProps) {
  return (
    <Button label={label}>
      <span style={{ backgroundColor: "red" }}>Primary</span>
    </Button>
  );
}

export function SecondaryButton({ label }: ButtonProps) {
  return (
    <Button label={label}>
      <span style={{ border: "2px dotted" }}>Secondary</span>
    </Button>
  );
}
```

Now we can create as many extensions of our Button component as needed without having to modify the core component itself. We demonstrated the OCP by incorporating it in our codebase, making it more extensible while remaining closed for modification. It nurtures code maintainability and allows us to integrate new features without less effort. Let’s move on to the next principle on our list!

### Liskov Substitution Principle

The Liskov Substitution Principle can be confusing for newer programmers. Simplifying it, it states the following:

"Objects of a superclass should be substitutable with objects of its subclasses without altering or breaking any functionality. If B is a subtype of A, then B should be able to be used everywhere A is used."

In short, objects of subclasses should behave in the same way as objects of its superclass. We don’t really follow this principle in React in a strict way, simply because React is not an object-oriented framework. It is one of the less relevant principles that we can apply to our frontend code since we should prefer writing code using hooks over classes and classes should play no or at most only a minor role in modern React code. However, we can map the core principle of LSP to React by saying that child components should be allowed to replace their parent component while maintaining the functionality. With the addition of TypeScript in our application, we can apply this principle more easily due to Typescripts feature of defining interfaces as contracts for the components we write. By doing so, we create interchangeable components without affecting the application's core functionality, making our code more maintainable and reusable.
To make things clearer, let’s take a look at the following code example.

```javascript
import { ChangeEvent, useState } from "react";

interface CustomSelectProps {
  value: number;
  iconClassName?: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export function CustomSelect({
  value,
  iconClassName,
  onChange,
}: CustomSelectProps) {
  return (
    <div>
      {iconClassName && <i className={iconClassName}></i>}
      <select value={value} onChange={onChange}>
        <option value={1}>One</option>
        <option value={2}>Two</option>
        <option value={3}>Three</option>
      </select>
    </div>
  );
}

export function App() {
  const [value, setValue] = useState<number>(1);

  function onChange(e: ChangeEvent<HTMLSelectElement>) {
    setValue(Number(e.target.value));
  }

  return (
    <div>
      <CustomSelect value={value} onChange={onChange} />
    </div>
  );
}
```

We have a component called CustomSelect whose functionality is to serve as a custom select input. However, this component violates the LSP. First, it not only modifies the behavior of the derived base select component, but it also restricts the base behavior of the base select element. If we wanted to include a defaultValue attribute to our select input, it would not work as of right now. More importantly, if we were to replace our custom select component with the base select component, we could potentially break our code due to unforseen problems. Since LSP states that we should be able to replace parent components with child components and vice versa, we thereby break the rules of this principle. Here is how we can improve our code to follow LSP:

```javascript
import { ChangeEvent, SelectHTMLAttributes, useState } from "react";

interface CustomSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  value: number;
  iconClassName?: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export function CustomSelect({
  value,
  iconClassName,
  onChange,
  ...props
}: CustomSelectProps) {
  return (
    <div>
      {iconClassName && <i className={iconClassName}></i>}
      <select value={value} onChange={onChange} {...props}>
        <option value={1}>One</option>
        <option value={2}>Two</option>
        <option value={3}>Three</option>
      </select>
    </div>
  );
}

export function App() {
  const [value, setValue] = useState<number>(1);

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setValue(Number(e.target.value));
  };

  return (
    <div>
      <CustomSelect value={value} onChange={onChange} defaultValue={1} />
    </div>
  );
}
```

We modified our CustomSelect component to adhere to the rules of LSP by extending the functionality of our CustomSelect interface with the corresponding HTMLAttributes interface for the base select element. This allows us to extend the functionality of the standard select element in React because our component now also accepts additional select attributes due to the ...props spread operator. This means that our CustomSelect component is able to use the base select element’s attributes such as defaultValue and many more, allowing us to replace the component with the base element and vice versa.

### Interface Segregation Principle

The Interface Segregation Principle (ISP). With TypeScript, we can define Interfaces as kind of a contract to our components. However, we should not rely upon interfaces that we don’t use. Moreover, interfaces should be kept small and cohesive, providing our components only with information that they actually need without having to worry about implementation details of the object we pass props from. More precisely, we should avoid passing the whole object as a prop to our components since the structure of the passed object might change in the future, changing or even entirely removing properties / attributes from it. This principle ties nicely with the Open Closed Principle since the component would be closed for modifications. Let’s take a look at an example to visualize this principle and make it more understandable:

```javascript
export interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <div>
      <p>{user.name}</p>
      <p>{user.email}</p>
      <p>{user.status}</p>
    </div>
  );
}
```

If we would pass the entire User object, whose properties changed, our component would not know about changes, thus most likely breaking it as our component has to worry about where the accessed properties are located that do not exist anymore. So how can we avoid this issue and avoid making our components more vulnerable to changes from the outside? It’s pretty straightforward: We don’t pass the whole object and instead, we only pass properties it actually needs. This way, if we were to change implementations from the outside, all we would need to do is pass along the proper information without the need to change code in our component. Our refactored UserProfile component would look like this:

```javascript
export interface UserProfileProps {
  name: string;
  email: string;
  status: string;
}

export function UserProfile({ name, email, status }: UserProfileProps) {
  return (
    <div>
      <p>{name}</p>
      <p>{email}</p>
      <p>{status}</p>
    </div>
  );
}
}
```

We have shown the advantage of using the ISP and how it works by destructuring needed props for our components. That way, our components are less vulnerable to less likely to break as they do not rely on the implementation details from their parent components anymore. Let’s move on to the last principle on our list.

### Dependency Inversion Principle

The Dependency Inversion Principle is the last of the five principles on our list. Just like the previous principles, it promotes flexibility, loose coupling, and maintainability in our codebase. In essence, this principle states that high-level modules should not depend on low-level modules. Instead, they should depend on abstractions. Moreover, abstractions should not depend on details, but details should depend on abstractions instead. Mapping it to React code, high-level components should not be dependent on low-level components. Instead, both should depend on abstractions like props or context. Functions in our React high-level code should not care how a specific logic is being handled. Let’s take a look at the following code snippet:

```javascript
import { FormEvent } from "react";

export function CreateUserForm() {
  const handleCreateUserForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch("https://exampleApi.com/users", {
        method: "POST",
        body: formData,
        headers: new Headers({ "content-type": "application/json" }),
      });

      if (!response.ok) {
        throw Error("Failed to send user data");
      }
    } catch (err) {
      console.error((err as Error).message);
    }
  };

  return (
    <form onSubmit={handleCreateUserForm}>
      <input name="firstName" placeholder="First Name" />
      <input name="lastName" placeholder="Last Name" />
      <input name="age" placeholder="Age" />
      <input name="email" placeholder="E-Mail" />
      <button type="submit">Create User</button>
    </form>
  );
}
```

We have a component called CreateUserForm which is responsible for creating a user by rendering a form and submitting the user data through a POST Request to our API However, our form is not reusable. If we wanted to create a form for editing user data instead of creating it. Naturally, we would create a new form which contains the same UI but only differs in the logic for handling the form data. This means that we would have to create a new endpoint to submit our form data, which implies that we also would have to create a new form since our component would be dependent on the logic of sending the data to our API:

```javascript
import { FormEvent } from "react";

export function EditUserForm(id: string) {
  const handleEditUserForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch(`https://exampleApi.com/users/${id}/edit`, {
        method: "PUT",
        body: formData,
        headers: new Headers({ "content-type": "application/json" }),
      });

      if (!response.ok) {
        throw Error("Failed to send user data");
      }
    } catch (err) {
      console.error((err as Error).message);
    }
  };

  return (
    <form onSubmit={handleEditUserForm}>
      <input name="firstName" placeholder="First Name" />
      <input name="lastName" placeholder="Last Name" />
      <input name="age" placeholder="Age" />
      <input name="email" placeholder="E-Mail" />
      <button type="submit">Edit User</button>
    </form>
  );
}
```

Now we have created two components, which render the same UI but only differ in their logic, making them dependent on that logic and thus, making them unreusable. Let’s refactor our code snippet so that we our components are not dependent on low-level modules anymore:

```javascript
type UserFormProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function UserForm({ onSubmit }: UserFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <input name="firstName" placeholder="First Name" />
      <input name="lastName" placeholder="Last Name" />
      <input name="age" placeholder="Age" />
      <input name="email" placeholder="E-Mail" />
      <button type="submit">Submit</button>
    </form>
  );
}

export function CreateUserForm() {
  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);

      const response = await fetch("https://exampleApi.com/users", {
        method: "POST",
        body: formData,
        headers: new Headers({ "content-type": "application/json" }),
      });

      if (!response.ok) {
        throw Error("Failed to send user data");
      }
    } catch (err) {
      console.error((err as Error).message);
    }
  };

  return <UserForm onSubmit={handleCreateUser} />;
}

export function EditUserForm(id: string) {
  const handleEditUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);

      const response = await fetch(`https://exampleApi.com/users/${id}/edit`, {
        method: "PUT",
        body: formData,
        headers: new Headers({ "content-type": "application/json" }),
      });

      if (!response.ok) {
        throw Error("Failed to send user data");
      }
    } catch (err) {
      console.error((err as Error).message);
    }
  };

  return <UserForm onSubmit={handleEditUser} />;
}
```

We decouple our UserForm component from the specific implementation of our data fetching service logic, making our component once again more flexible. We could change the source of our fetched data with another implementation if needed without changing our UserForm component. Instead, we can pass the necessary onSubmit logic through our UserFormProps to our component. Our form does not need to know the implementation details of the passed logic, thus creating a nice separation of concerns.

## Typescript guidelines

Typescript guidelines should be follow using the [official Google Typescript Style Guidelines](https://google.github.io/styleguide/tsguide.html)
