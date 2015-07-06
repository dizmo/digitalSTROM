//= compat
//= require <flab/Namespace>
//= require <flab/MessageBusImpl>

flab.Namespace.create("flab");

/**
 * Static object which provides a message bus. See also <code>flab.MessageBusImpl</code>.
 *
 * @see flab.MessageBusImpl
 * @type flab.MessageBusImpl
 * @static
 */
flab.MessageBus = new flab.MessageBusImpl();
