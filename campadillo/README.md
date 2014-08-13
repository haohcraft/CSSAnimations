Credits from http://campadillo.com/

The demo http://jsfiddle.net/haohcraft/cg8uqdLd/

The CSS code

- mouse srolling down animation
The benefit of setting the wrapper:hover as the triger to the animation is to avoid multiple trigers when hovering the icon itself



		    //============Sroll Down======
			    @-webkit-keyframes bounce {
			        0%, 20%, 50%, 80%, 100% { -webkit-transform: translateY(0); }
			        40% { -webkit-transform: translateY(-12px); }
			        60% { -webkit-transform: translateY(-12px); }
			    }

			    @keyframes bounce {
			        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
			        40% { transform: translateY(-12px); }
			        60% { transform: translateY(-12px); }
			    }

			  //======shaking
			@-webkit-keyframes icon-animation-shake {
			    0%    { -webkit-transform: rotate(0deg); }
			    20%   { -webkit-transform: rotate(15deg); }
			    40%   { -webkit-transform: rotate(-15deg); }
			    60%   { -webkit-transform: rotate(6deg); }
			    80%   { -webkit-transform: rotate(-6deg); }
			    100%  { -webkit-transform: rotate(0deg); }
			}
			@keyframes icon-animation-shake {
			    0%    { transform: rotate(0deg); }
			    20%   { transform: rotate(15deg); }
			    40%   { transform: rotate(-15deg); }
			    60%   { transform: rotate(6deg); }
			    80%   { transform: rotate(-6deg); }
			    100%  { transform: rotate(0deg); }
			}

			body {
			    background-color: #000000;
			}

			    .scroll-down {
			        cursor: pointer;

			        -webkit-animation: bounce 3s infinite;
			                animation: bounce 3s infinite;
			    }
			.icon-shake-wrapper {
			    width: 200px;
			    height: 220px
			        &:hover {
			            .icon-shake {
			                -webkit-animation: icon-animation-shake 1s;
			                   -moz-animation: icon-animation-shake 1s;
			                     -o-animation: icon-animation-shake 1s;
			                        animation: icon-animation-shake 1s;
			            }
			        }
			}
			.icon-shake {
			    padding-top: 10px;
			}
