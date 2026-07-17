try { require('express'); console.log('express ok'); } catch(e) { console.error('express', e.message); }
try { require('http'); console.log('http ok'); } catch(e) { console.error('http', e.message); }
try { require('socket.io'); console.log('socket.io ok'); } catch(e) { console.error('socket.io', e.message); }
try { require('cors'); console.log('cors ok'); } catch(e) { console.error('cors', e.message); }
try { require('path'); console.log('path ok'); } catch(e) { console.error('path', e.message); }
try { require('helmet'); console.log('helmet ok'); } catch(e) { console.error('helmet', e.message); }
try { require('compression'); console.log('compression ok'); } catch(e) { console.error('compression', e.message); }
