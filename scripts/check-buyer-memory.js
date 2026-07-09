const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('outputs/gold-house-computer-preview.html', 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>/)[1];

let savedStorage = {};
let timeoutCalls = [];

function createContext() {
  const root = { innerHTML: '' };
  const document = {
    getElementById(id) {
      return id === 'root' ? root : { innerHTML: '' };
    },
  };
  const localStorage = {
    getItem(key) {
      return savedStorage[key] ?? null;
    },
    setItem(key, value) {
      savedStorage[key] = String(value);
    },
  };

  const context = {
    console,
    document,
    localStorage,
    location: { href: '' },
    scrollTo() {},
    alert() {},
    setTimeout(fn, ms) {
      timeoutCalls.push(ms);
      if (typeof fn === 'function') fn();
      return 1;
    },
    clearTimeout() {},
  };
  vm.createContext(context);
  vm.runInContext(script, context);
  return context;
}

let context = createContext();
vm.runInContext("buyer.name='Нурхан';const phoneInput={value:'77771112233',setSelectionRange(){}};setBuyerPhone(phoneInput);saveBuyerProfile();", context);
const formattedPhone = vm.runInContext('buyer.phone', context);
if (formattedPhone !== '+7 777 111 22 33') throw new Error(`Phone format failed: ${formattedPhone}`);
const inputPhone = vm.runInContext('phoneInput.value', context);
if (inputPhone !== '+7 777 111 22 33') throw new Error(`Phone input value was not formatted in place: ${inputPhone}`);
if (!timeoutCalls.includes(2200)) throw new Error('Buyer profile success message delay is not 2200ms.');
vm.runInContext(
  "recordBuyerSignal(props[0].id,'like');recordBuyerSignal(props[1].id,'dislike');recordBuyerSignal(props[0].id,'view_details',2400);recordBuyerSignal(props[0].id,'owner_call');recordBuyerSignal(props[0].id,'booking_request');",
  context,
);

const stored = JSON.parse(savedStorage['gold-house-buyer-memory-v1']);
if (stored.profiles.length !== 1) throw new Error('Buyer profile was not persisted.');
if (stored.buyerEvents.length !== 5) throw new Error(`Expected 5 buyer events, got ${stored.buyerEvents.length}.`);
if (stored.buyerEvents.some((event) => !event.propertySnapshot || !event.propertySnapshot.propertyId || !event.propertySnapshot.residentialComplex)) {
  throw new Error('Buyer event snapshot is missing required property data.');
}

context = createContext();
vm.runInContext("buyer.name='Нурхан';setBuyerPhone('+7 777 111 22 33');saveBuyerProfile();", context);
const restored = vm.runInContext("({profiles:buyer.profiles.length, events:buyer.signals.length, message:buyer.message, active:buyer.active.id, screen:s.screen})", context);
if (restored.profiles !== 1) throw new Error('Repeated phone login created a duplicate profile.');
if (restored.events !== 5) throw new Error('Repeated phone login did not load event history.');
if (!String(restored.message).includes('Добро пожаловать снова')) throw new Error('Repeated phone login did not show restore message.');
if (restored.screen !== 16) throw new Error(`Repeated phone login should open buyer cabinet, got screen ${restored.screen}.`);

vm.runInContext('logoutBuyer();render();', context);
const afterLogout = vm.runInContext("({screen:s.screen, active:buyer.active, skipAuto:buyer.skipAuto, html:document.getElementById('root').innerHTML})", context);
if (afterLogout.active !== null) throw new Error('Logout did not clear active buyer.');
if (!afterLogout.skipAuto) throw new Error('Logout did not disable automatic profile restore.');
if (afterLogout.screen !== 1 || !String(afterLogout.html).includes('Добро пожаловать в Gold House')) {
  throw new Error('Logout should return to welcome without opening buyer cabinet.');
}

context = createContext();
const autoAfterLogout = vm.runInContext("({screen:s.screen, active:buyer.active, skipAuto:buyer.skipAuto, html:document.getElementById('root').innerHTML})", context);
if (autoAfterLogout.active !== null) throw new Error('Saved profile auto-restored after logout.');
if (!String(autoAfterLogout.html).includes('Добро пожаловать в Gold House')) throw new Error('Welcome screen should stay visible after logout.');

vm.runInContext('continueGuest();recordBuyerSignal(props[2].id,"like");', context);
const guestEvent = vm.runInContext('buyer.signals[0]', context);
if (!guestEvent.buyerId.startsWith('anonymous-')) throw new Error('Anonymous session did not record anonymous buyer id.');

console.log('Buyer memory profile, cabinet restore, logout, guest mode, event snapshot check passed.');
