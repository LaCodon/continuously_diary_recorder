const moment = require('moment')

/**
 * Stage user data
 * @param  {String} params.type Message type
 * @param  {String} params.content Message content
 */
async function stageMessage(state, event, { type, content }) {
  const userId = event.user.id
  const oldData = await event.bp.kvs.get(getKvsKey(userId)) || getEmptyUserObj()

  let newData = {
    ...oldData
  }
  newData[type].push(getMessageObj(moment(), content))

  await event.bp.kvs.set(getKvsKey(userId), newData)

  return state
}

/**
 * Load the current diary into state.diary
 */
async function getUserDiary(state, event, { }) {
  const userId = event.user.id
  const currentData = await event.bp.kvs.get(getKvsKey(userId)) || getEmptyUserObj()
  return {
    ...state,
    diary: currentData
  }
}

/**
 * Loads rendered diary in state.rendered
 */
async function markdownDiary(state, event, { }) {
  const data = state.diary || getEmptyUserObj()

  let output = ''

  const types = Object.keys(data)
  for (let i = 0; i < types.length; i++) {
    const type = types[i]
    console.log(type, data[type])

    output += '\n**' + type + '**\n'
    for (let n = 0; n < data[type].length; n++) {
      output += ' - ' + data[type][n].msg + '\n'
    }
  }

  return {
    ...state,
    rendered: output
  }
}

function getKvsKey(userId) {
  return `stagedata/${userId}`
}

function getEmptyUserObj() {
  return {
    message_planned: [],
    message_done: [],
    message_blocked: [],
    message_availability: []
  }
}

function getMessageObj(ts, msg) {
  return {
    ts: ts,
    msg: msg
  }
}

/**
 * Set a state variable (later access it with {{state.var}})
 * @param {String} params.name variable name
 * @param {String} params.value variable value
 */
async function setStateVariable(state, event, { name, value }) {
  return {
    ...state,
    [name]: value
  }
}

module.exports = { stageMessage, setStateVariable, getUserDiary, markdownDiary }
