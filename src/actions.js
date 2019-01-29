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
 * Delete the current diary
 */
async function deleteDiary(state, event, { }) {
  const userId = event.user.id
  await event.bp.kvs.set(getKvsKey(userId), getEmptyUserObj())
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
  if (userId === undefined)
    userId = ''

  return `stagedata/${userId}`
}

async function getKnownUsers(bp) {
  const knex = await bp.db.get()
  const ids = await knex('kvs').select('key').where('key', 'like', `%${getKvsKey()}%`)
    .then(async res => {
      let ids = [];
      for (let i = 0; i < res.length; i++) {
        let id = res[i].key.replace(getKvsKey(), '')
        const name = await getUsername(bp, id)
        ids.push({
          id: id,
          name: name
        })
      }
      return ids
    })
  return ids
}

async function getUsername(bp, userId) {
  const knex = await bp.db.get()
  const name = await knex('users').select('first_name').where('userId', userId).limit(1)
    .then(res => res[0].first_name)
  return name
}

function getEmptyUserObj() {
  return {
    message_planned: [],
    message_done: [],
    message_blocked: [],
    message_availability: [],
    message_none: []
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

/**
 * Output current state or given var
 * @param {string} params.obj The var to be printed
 */
async function debug(state, event, { obj }) {
  if (obj === undefined || !obj) {
    console.log('debug: ', state)
    console.log(event.nlu)
  } else {
    console.log('debug_obj:')
    console.log(obj)
  }
}

/**
 * Get the message type by its recognized entities
 */
async function getTypeByEntity(state, event, { }) {
  let type = event.nlu.intent.name || null
  const entities = event.nlu.entities || []

  if (entities.length > 0) {
    type = entities[0].type
  }

  return {
    ...state,
    type: type
  }
}

module.exports = { stageMessage, setStateVariable, getUserDiary, markdownDiary, debug, getTypeByEntity, getKvsKey, getEmptyUserObj, getKnownUsers, deleteDiary }
