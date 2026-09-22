#!/bin/bash
mv components/categories/* components/inventory/ 2>/dev/null
rmdir components/categories 2>/dev/null

mv components/modifiers/* components/inventory/ 2>/dev/null
rmdir components/modifiers 2>/dev/null

mv components/items/* components/inventory/ 2>/dev/null
rmdir components/items 2>/dev/null

mv components/printers/* components/hardware/ 2>/dev/null
rmdir components/printers 2>/dev/null

mv components/removeditems/* components/inventory/ 2>/dev/null
rmdir components/removeditems 2>/dev/null

mv components/customers/* components/crm/ 2>/dev/null
rmdir components/customers 2>/dev/null

mv components/discounts/* components/inventory/ 2>/dev/null
rmdir components/discounts 2>/dev/null

mv components/documents/* components/admin/ 2>/dev/null
rmdir components/documents 2>/dev/null

mv components/employees/* components/staff/ 2>/dev/null
rmdir components/employees 2>/dev/null

mv components/transactions/* components/finances/ 2>/dev/null
rmdir components/transactions 2>/dev/null

mv components/floorplan/* components/dining/ 2>/dev/null
rmdir components/floorplan 2>/dev/null

mv components/tableservice/* components/dining/ 2>/dev/null
rmdir components/tableservice 2>/dev/null

