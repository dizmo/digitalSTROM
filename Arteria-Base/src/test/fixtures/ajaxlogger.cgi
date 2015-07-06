#!/usr/bin/env perl

use strict;
use warnings;

use JSON::Any;
use CGI qw/:standard/;
use CGI::Carp qw(fatalsToBrowser);
use File::stat;
use Data::Dumper;

my $cgi = CGI->new();

my $level = $cgi->param('level');
my $appid = $cgi->param('appid');
my $msg = $cgi->param('msg');

my $result = {  
    result => 'success',
    data => {
        level => $level,
        appid => $appid,
        msg => $msg,
    },
};

print $cgi->header(-type => 'application/json');

print JSON::Any->new()->objToJson($result);
