import './App.css';
import { useEffect, useRef, useState } from 'react';
import { Text,Title,Button,Modal,TextInput,Group,Container,ActionIcon } from '@mantine/core';
import {MantineProvider,ColorSchemeProvider} from '@mantine/core'
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import WbSunnyTwoToneIcon from '@mui/icons-material/WbSunnyTwoTone';
import DarkModeTwoToneIcon from '@mui/icons-material/DarkModeTwoTone';
import { Card } from '@mui/material';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';

function App() {
  const [tasks,setTasks] = useState([]);
  const [opened,setOpened] = useState(false);

  const [colorScheme,setColorScheme] = useLocalStorage({
    key:'mantine-color-scheme',
    defaultValue :'light',
    getInitialValueInEffect :true,
  })

  const taskTitle = useRef('');
  const taskSummary = useRef('');

  // const preferredColorScheme = useColorScheme();

  const toggleColorScheme =value=>(setColorScheme(value || colorScheme === 'dark' ? 'light' : 'dark'))
  useHotkeys([['mod+J',()=>toggleColorScheme()]]);
  const createTasks = ()=>{
    setTasks([
      ...tasks,
      {
        title:taskTitle.current.value,
        summary:taskSummary.current.value,
      },
    ]);
    saveTasks([
      ...tasks,{
        title:taskTitle.current.value,
        summary:taskSummary.current.value,
      }
    ])
  }

  const loadTasks = () =>{
    let loadedTasks = localStorage.getItem('tasks');
    let tasks = JSON.parse(loadedTasks);
    if(tasks){
      setTasks(tasks);
    }
  }

  const deleteTask=(index)=>{
    var clonedTasks = [...tasks];
    clonedTasks.splice(index,1);
    setTasks(clonedTasks);
    saveTasks([...clonedTasks])
  }

  const saveTasks = (tasks)=>{
    localStorage.setItem('tasks',JSON.stringify(tasks));
  }

  useEffect(()=>{
    loadTasks();
  },[])
  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{colorScheme , defaultRadius:'md'}} withGlobalStyles withNormalizeCSS>
      <div className="App">
        <Modal opened ={opened} size={'md'} title = {'New Task'} withCloseButton ={false}
          onClose={()=>{
            setOpened(false);
          }}
          centered>
            <TextInput ref = {taskTitle} placeholder={'Task Title'} required label = {'Title'}/>
            <TextInput ref = {taskSummary} placeholder={'Task Summary'} required label = {'Summary'}/>
            <Group mt={'md'} position={'apart'}>
              <Button onClick = {()=>{
                setOpened(false);
              }} variant = {'subtle'}>Cancel</Button>
              <Button onClick = {()=>{
                createTasks()
                setOpened(false)
              }} variant = {'subtle'}>Create Task</Button>
            </Group>
        </Modal>

        <Container size ={550} my={40}>
          <Group position = {'apart'}>
            <Title sx = {theme => ({
              fontFamily : `${theme.fontFamily}`,
              fontWeight:900,
            })}>
              My Tasks
            </Title>

            <ActionIcon color = {'blue'} onClick={()=>toggleColorScheme()} size ={'lg'}>
              {colorScheme === 'dark' ? (
                <WbSunnyTwoToneIcon size={16}/>
              ):(
                <DarkModeTwoToneIcon size = {16}/>
              )}
            </ActionIcon>
          </Group>
          {tasks.length > 0 ? (
            tasks.map((task,index)=>{
              if(task.title){
                return (
                  <Card withBorder key={index} mt={'sm'}>
                    <Group position={'apart'}>
                      <Text weight ={'bold'}>{task.title}</Text>
                      <ActionIcon onClick ={()=>{
                        deleteTask(index);
                      }} color={'red'} variant={'transparent'}>
                        <DeleteOutlineTwoToneIcon/>
                      </ActionIcon>
                    </Group>
                    <Text clor={'dimmed'} size={'md'} mt={'sm'}>
                      {task.summary ? task.summary : 'No summary'}
                    </Text>
                  </Card>
                );
              }
            })):(
              <Text size = {'lg'} mt={'md'} color={'dimmed'}>
                You have no tasks
              </Text>
          ) }
          <Button onClick={()=>{
            setOpened(true);
          }} fullWidth mt={'md'}>New Task</Button>
        </Container>
      </div>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
