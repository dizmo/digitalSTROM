//= compat
//= require <flab/Namespace>
//= require <Interface>

flab.Namespace.create('flab.command');


/**
 * The interface for commands.
 *
 * @type Interface
 */
flab.command.Command = new Interface('flab.command.Command', ['execute']);

