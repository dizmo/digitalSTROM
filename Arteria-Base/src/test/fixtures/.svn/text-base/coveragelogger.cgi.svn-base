#!/usr/bin/env perl

use strict;
use warnings;

use CGI::Carp qw(fatalsToBrowser);

use Web::Simple 'Coverage';

{
    package Coverage;

    use Data::Dumper;
    use File::Slurp;

    sub dispatch_request {
        sub (%@*) {
            my ($self, $params) = @_;
            warn Dumper([$params]);
            write_file('coverage_report.json', $params->{coverage});
            [ 200, [ 'Content-type', 'text/plain' ], [ 'Ok' ] ]
        }
    };
    if ($Web::Simple::VERSION <= 0.006) {
        dispatch(\&dispatch_request);
    }
}

Coverage->run_if_script;
