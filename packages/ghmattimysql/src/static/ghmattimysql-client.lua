local isNuiActive = false

function setNuiActive(booleanOrNil)
  local boolean = true
  if booleanOrNil ~= nil then boolean = booleanOrNil end
  if boolean ~= isNuiActive then
    if boolean then TriggerServerEvent('ghmattimysql:request-data') end
    isNuiActive = boolean
    SendNUIMessage({ type = 'onToggleShow' })
    SetNuiFocus(boolean, boolean)
  end
end

RegisterCommand('mysql', function()
  setNuiActive()
end, true)

RegisterNUICallback('close-explorer', function()
  setNuiActive(false)
end)

Citizen.CreateThread(function()
  if isNuiActive then TriggerServerEvent('ghmattimysql:request-data') end
  Citizen.Wait(300000)
end)

function isArray(t)
  local i = 0
  for _ in pairs(t) do
      i = i + 1
      if t[i] == nil then return false end
  end
  return true
end

function map(table, callback)
  local newTable = {}
  for i = 1, #table do
    newTable[i] = callback(table[i], i)
  end
  return newTable
end

function filter(table, callback)
  local newTable = {}
  for i = 1, #table do
    if callback(table[i], i) then
      newTable[i] = table[i]
    end
  end
  return newTable
end

RegisterNetEvent('ghmattimysql:update-resource-data')
AddEventHandler('ghmattimysql:update-resource-data', function (resourceData)
  local arrayToSortAndMap = {}
  for resource, data in pairs(resourceData) do
    table.insert(arrayToSortAndMap, {
      resource = resource,
      queryTime = data.totalExecutionTime,
      count = data.queryCount,
    })
  end
  if #arrayToSortAndMap > 0 then
    table.sort(arrayToSortAndMap, function(a, b) return a.queryTime > b.queryTime end)
    local len = #arrayToSortAndMap
    arrayToSortAndMap = filter(arrayToSortAndMap, function(_, index) return index > len - 30 end)
    table.sort(arrayToSortAndMap, function(a, b) return a.resource:upper() > b.resource:upper() end)
    SendNUIMessage({
      type = 'onResourceLabels',
      resourceLabels = map(arrayToSortAndMap, function(el) return el.resource end),
    })
    SendNUIMessage({
      type = 'onResourceData',
      resourceData = {
        { data  = map(arrayToSortAndMap, function(el) return el.queryTime end) },
        { data  = map(arrayToSortAndMap, function(el) if el.count > 0 then return el.queryTime / el.count end return 0 end) },
        { data  = map(arrayToSortAndMap, function(el) return el.count end) },
      },
    })
  end
end)

RegisterNetEvent('ghmattimysql:update-time-data')
AddEventHandler('ghmattimysql:update-time-data', function (timeData)
  local timeArray = {}
  if isArray(timeData) then
    local len = #timeData
    timeArray = filter(timeData, function(_, index) return index > len - 30 end)
  end
  if #timeArray > 0 then
    SendNUIMessage({
      type = 'onTimeData',
      timeData = {
        { data = map(timeArray, function(el) return el.totalExecutionTime end) },
        { data = map(timeArray, function(el) if el.queryCount > 0 then return el.totalExecutionTime / el.queryCount end return 0 end) },
        { data = map(timeArray, function(el) return el.queryCount end) },
      }
    })
  end
end)

RegisterNetEvent('ghmattimysql:update-slow-queries')
AddEventHandler('ghmattimysql:update-slow-queries', function(slowQueryData)
  local slowQueries = slowQueryData
  for i = 1, #slowQueries do
    slowQueries[i].queryTime = math.floor(slowQueries[i].queryTime * 100 + 0.5) / 100
  end
  SendNUIMessage({
    type = 'onSlowQueryData',
    slowQueries = slowQueries,
  });
end)
