Credits from http://campadillo.com/

The demo http://jsfiddle.net/haohcraft/cg8uqdLd/

The CSS code

	- mouse srolling down animation

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

		.scroll-down .mouse {
		    cursor: pointer;

		    -webkit-animation: bounce 3s infinite;
		            animation: bounce 3s infinite;
		}